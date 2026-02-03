"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  NameEntry,
  SandwichSelection,
  BreadSelection,
  DressingSelection,
  OrderSummary,
  SuccessMessage,
} from "@/components/menu";
import { sandwiches, breads, dressings } from "@/data/menu";
import styles from "@/styles/pages/menu.module.scss";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export default function MenuPage() {
  const params = useParams();
  const router = useRouter();
  const menuId = params.id as string;

  const [selectedSandwich, setSelectedSandwich] = useState<number | null>(null);
  const [selectedBread, setSelectedBread] = useState<string | null>(null);
  const [selectedDressing, setSelectedDressing] = useState<string | null>(null);
  const [sessionValid, setSessionValid] = useState<boolean | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [nameSubmitted, setNameSubmitted] = useState(false);
  const [alreadyOrdered, setAlreadyOrdered] = useState(false);
  const [orderDetails, setOrderDetails] = useState<{
    sandwich: string;
    bread?: string;
    dressing?: string;
    image?: string;
  } | null>(null);
  const [isDeletingOrder, setIsDeletingOrder] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  // Validate session and check if orders exist
  useEffect(() => {
    const validateSession = async () => {
      try {
        const response = await fetch(`${API_URL}/sessions/${menuId}`);
        const data = await response.json();

        if (data.ok) {
          setSessionValid(true);

          // Check if session has any orders remaining
          try {
            const hasOrdersResponse = await fetch(
              `${API_URL}/sessions/${menuId}/has-orders`,
            );
            const hasOrdersData = await hasOrdersResponse.json();

            // If session exists but has no orders, clear sessionStorage
            // This allows re-ordering after admin deletion
            if (hasOrdersData.ok && !hasOrdersData.hasOrders) {
              const orderedSessions = JSON.parse(
                sessionStorage.getItem("orderedSessions") || "[]",
              );
              const filtered = orderedSessions.filter(
                (code: string) => code !== menuId,
              );
              sessionStorage.setItem(
                "orderedSessions",
                JSON.stringify(filtered),
              );
              setAlreadyOrdered(false);
            } else {
              // Session has orders, check if user already ordered
              const orderedSessions = JSON.parse(
                sessionStorage.getItem("orderedSessions") || "[]",
              );
              if (orderedSessions.includes(menuId)) {
                setAlreadyOrdered(true);
                // Try to fetch their order details from sessionStorage first
                const savedOrderDetails = sessionStorage.getItem(
                  `orderDetails_${menuId}`,
                );
                if (savedOrderDetails) {
                  try {
                    setOrderDetails(JSON.parse(savedOrderDetails));
                  } catch {
                    // If parsing fails, order details will remain null
                  }
                }
                // Restore customer name for deletion
                const savedCustomerName = sessionStorage.getItem(
                  `customerName_${menuId}`,
                );
                if (savedCustomerName) {
                  setCustomerName(savedCustomerName);
                }
                // Restore order ID for secure deletion
                const savedOrderId = sessionStorage.getItem(
                  `orderId_${menuId}`,
                );
                if (savedOrderId) {
                  setOrderId(savedOrderId);
                }
              }
            }
          } catch {
            // Fallback: just check sessionStorage
            const orderedSessions = JSON.parse(
              sessionStorage.getItem("orderedSessions") || "[]",
            );
            if (orderedSessions.includes(menuId)) {
              setAlreadyOrdered(true);
            }
          }
        } else {
          setSessionValid(false);
        }
      } catch {
        setSessionValid(false);
      }
    };
    validateSession();
  }, [menuId]);

  const selectedSandwichData = selectedSandwich
    ? sandwiches[selectedSandwich - 1]
    : null;
  const isNoBreadDressing = selectedSandwichData?.noBreadDressing || false;

  const handleSubmitOrder = async () => {
    if (!selectedSandwich) {
      alert("Vælg venligst en sandwich");
      return;
    }

    setSubmitting(true);
    setError("");

    const selectedSandwich_ = sandwiches[selectedSandwich - 1];
    const order = {
      sandwich: selectedSandwich_.name,
      bread: isNoBreadDressing ? undefined : selectedBread || "lyst",
      dressing: isNoBreadDressing
        ? undefined
        : selectedDressing
          ? dressings.find((d) => d.id === selectedDressing)?.name
          : "Ingen",
      image: selectedSandwich_.image,
      url: selectedSandwich_.url,
      customer: customerName,
    };

    try {
      const response = await fetch(`${API_URL}/sessions/${menuId}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(order),
      });

      const data = await response.json();

      if (data.ok) {
        // Save order ID for secure deletion
        if (data.orderId) {
          setOrderId(data.orderId);
          sessionStorage.setItem(`orderId_${menuId}`, data.orderId);
        }
        // Save order details for display
        const orderDetailsToSave = {
          sandwich: order.sandwich,
          bread: order.bread,
          dressing: order.dressing,
          image: order.image,
        };
        setOrderDetails(orderDetailsToSave);
        // Save order details to sessionStorage to persist within browser session
        sessionStorage.setItem(
          `orderDetails_${menuId}`,
          JSON.stringify(orderDetailsToSave),
        );
        // Save customer name for later deletion (trim to remove whitespace)
        sessionStorage.setItem(`customerName_${menuId}`, customerName.trim());
        // Save to sessionStorage to prevent ordering again
        const orderedSessions = JSON.parse(
          sessionStorage.getItem("orderedSessions") || "[]",
        );
        orderedSessions.push(menuId);
        sessionStorage.setItem(
          "orderedSessions",
          JSON.stringify(orderedSessions),
        );
        setSubmitted(true);
      } else {
        setError(data.message || "Kunne ikke gemme ordren");
      }
    } catch {
      setError("Kunne ikke forbinde til serveren");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteOrder = async () => {
    if (!window.confirm("Er du sikker på, at du vil slette din ordre?")) {
      return;
    }

    if (!orderId) {
      // No orderId means old order without ID - can't delete securely
      alert(
        "Kunne ikke finde din ordre. Din ordre blev oprettet før slettefunktionen blev tilføjet.",
      );
      return;
    }

    setIsDeletingOrder(true);

    try {
      const response = await fetch(
        `${API_URL}/sessions/${menuId}/orders/self/${orderId}`,
        {
          method: "DELETE",
        },
      );

      const data = await response.json();

      if (data.ok) {
        // Remove from sessionStorage
        const orderedSessions = JSON.parse(
          sessionStorage.getItem("orderedSessions") || "[]",
        );
        const filtered = orderedSessions.filter(
          (code: string) => code !== menuId,
        );
        sessionStorage.setItem("orderedSessions", JSON.stringify(filtered));
        // Also remove order details, customer name, and order ID from sessionStorage
        sessionStorage.removeItem(`orderDetails_${menuId}`);
        sessionStorage.removeItem(`customerName_${menuId}`);
        sessionStorage.removeItem(`orderId_${menuId}`);

        // Reset all states to allow reordering
        setAlreadyOrdered(false);
        setOrderDetails(null);
        setOrderId(null);
        setNameSubmitted(false);
        setCustomerName("");
        setSelectedSandwich(null);
        setSelectedBread(null);
        setSelectedDressing(null);
        setSubmitted(false);
      } else {
        alert("Kunne ikke slette ordren: " + (data.message || "Ukendt fejl"));
      }
    } catch {
      alert("Fejl ved sletning af ordre");
    } finally {
      setIsDeletingOrder(false);
    }
  };

  // Show loading state
  if (sessionValid === null) {
    return (
      <div className={styles.menuContainer}>
        <div className={styles.loadingMessage}>Indlæser menu...</div>
      </div>
    );
  }

  // Show error if session is invalid
  if (!sessionValid) {
    return (
      <div className={styles.menuContainer}>
        <div className={styles.errorMessage}>
          <h2>Session ikke fundet</h2>
          <p>Denne menu-session findes ikke eller er udløbet.</p>
        </div>
      </div>
    );
  }

  // Show name entry screen
  if (!nameSubmitted) {
    return (
      <div className={styles.menuContainer}>
        <NameEntry
          customerName={customerName}
          onNameChange={setCustomerName}
          onSubmit={() => {
            if (customerName.trim()) {
              setNameSubmitted(true);
            }
          }}
        />
      </div>
    );
  }

  // Show success message
  if (submitted || alreadyOrdered) {
    return (
      <>
        <div className={styles.menuContainer}>
          <SuccessMessage
            customerName={customerName}
            order={orderDetails || undefined}
            onDelete={handleDeleteOrder}
            isDeleting={isDeletingOrder}
          />
        </div>
      </>
    );
  }

  return (
    <div className={styles.menuContainer}>
      <SandwichSelection
        sandwiches={sandwiches}
        selectedSandwich={selectedSandwich}
        onSelect={(id) => {
          setSelectedSandwich(id);
          const sandwich = sandwiches.find((s) => s.id === id);
          if (sandwich?.noBreadDressing) {
            setSelectedBread(null);
            setSelectedDressing(null);
          } else {
            if (!selectedBread) {
              setSelectedBread("lyst");
            }
            if (!selectedDressing) {
              setSelectedDressing("ingen");
            }
          }
          // Scroll to bread section after state update
          setTimeout(() => {
            const breadSection = document.getElementById("bread");
            if (breadSection) {
              breadSection.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }
          }, 100);
        }}
      />

      <BreadSelection
        breads={breads}
        selectedBread={selectedBread}
        onSelect={setSelectedBread}
        disabled={isNoBreadDressing}
      />

      <DressingSelection
        dressings={dressings}
        selectedDressing={selectedDressing}
        onSelect={setSelectedDressing}
        disabled={isNoBreadDressing}
      />

      <OrderSummary
        sandwiches={sandwiches}
        selectedSandwich={selectedSandwich}
        selectedBread={selectedBread}
        selectedDressing={selectedDressing}
        dressings={dressings}
        isNoBreadDressing={isNoBreadDressing}
        error={error}
        submitting={submitting}
        onSubmit={handleSubmitOrder}
      />
    </div>
  );
}
