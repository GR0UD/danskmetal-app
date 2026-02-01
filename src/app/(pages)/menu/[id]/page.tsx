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
import styles from "./menu.module.scss";

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

  // Check if user already ordered in this session
  useEffect(() => {
    const orderedSessions = JSON.parse(
      localStorage.getItem("orderedSessions") || "[]",
    );
    if (orderedSessions.includes(menuId)) {
      setAlreadyOrdered(true);
    }
  }, [menuId]);

  // Validate session on mount
  useEffect(() => {
    const validateSession = async () => {
      try {
        const response = await fetch(`${API_URL}/sessions/${menuId}`);
        const data = await response.json();
        setSessionValid(data.ok);
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
        // Save to localStorage to prevent ordering again
        const orderedSessions = JSON.parse(
          localStorage.getItem("orderedSessions") || "[]",
        );
        orderedSessions.push(menuId);
        localStorage.setItem(
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

  // Show message if user already ordered
  if (alreadyOrdered) {
    return (
      <div className={styles.menuContainer}>
        <SuccessMessage customerName="" />
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
  if (submitted) {
    return (
      <div className={styles.menuContainer}>
        <SuccessMessage customerName={customerName} />
      </div>
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
