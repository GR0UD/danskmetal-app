"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { GiKetchup } from "react-icons/gi";
import { TbBread, TbBreadFilled } from "react-icons/tb";
import { TbX } from "react-icons/tb";
import { BiSolidBowlRice } from "react-icons/bi";
import {
  NameEntry,
  SandwichSelection,
  BreadSelection,
  DressingSelection,
  OrderSummary,
  SuccessMessage,
} from "@/components/menu";
import type {
  Sandwich,
  BreadOption,
  DressingOption,
} from "@/components/menu";
import styles from "./menu.module.scss";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

const BreadIcon = () => <TbBread size={32} />;
const DarkBreadIcon = () => <TbBreadFilled size={32} />;
const DressingIcon = () => <GiKetchup size={32} />;
const NoIcon = () => <TbX size={32} />;

export default function MenuPage() {
  const params = useParams();
  const router = useRouter();
  const menuId = params.id as string;

  const sandwiches: Sandwich[] = [
    {
      id: 1,
      name: "Frikadelle",
      description: "Frikadelle, rødkål og syltet agurker",
      image: "/images/frikadelle.webp",
      hasImage: true,
      url: "https://seestbageri.dk/vare/sandwich-med-frikadelle-roedkaal-og-syltede-agurker/",
    },
    {
      id: 2,
      name: "Kylling & Bacon",
      description: "Kylling og bacon",
      image: "/images/kylling-bacon.webp",
      hasImage: true,
      url: "https://seestbageri.dk/vare/sandwich-m-kylling-og-bacon/",
    },
    {
      id: 3,
      name: "Kylling & Salsa",
      description: "Kylling, salsa og nachos",
      image: "/images/kylling-salsa.webp",
      hasImage: true,
      url: "https://seestbageri.dk/vare/sandwich-m-kylling-og-nachos/",
    },
    {
      id: 4,
      name: "Tun",
      description: "Tun, æg og rødløg",
      image: "/images/tun.webp",
      hasImage: true,
      url: "https://seestbageri.dk/vare/sandwich-m-tun-og-aeg/",
    },
    {
      id: 5,
      name: "Kalkun & Ost",
      description: "Kalkun og ost",
      image: "/images/kalkun.webp",
      hasImage: true,
      url: "https://seestbageri.dk/vare/sandwich-med-kalkun-og-ost/",
    },
    {
      id: 6,
      name: "Spegepølse",
      description: "Spegepølse, remoulade og ristet løg",
      image: "",
      hasImage: false,
      url: "https://seestbageri.dk/vare/sandwich-m-spegepoelse-remoulade-og-ristet-loeg/",
    },
    {
      id: 7,
      name: "Falafel",
      description: "Falafel og revet gulerødder",
      image: "",
      hasImage: false,
      url: "https://seestbageri.dk/vare/sandwich-m-humus-falafel-og-revet-guleroedder/",
    },
    {
      id: 8,
      name: "Pastasalat",
      description: "Pastasalat m. krydret kylling",
      image: "",
      hasImage: false,
      noBreadDressing: true,
      customIcon: <BiSolidBowlRice className={styles.sandwichIcon} />,
      url: "https://seestbageri.dk/vare/pastasalat-m-krydret-kylling/",
    },
  ];

  const dressings: DressingOption[] = [
    { id: "karry", name: "Karry", icon: <DressingIcon /> },
    { id: "creme", name: "Creme Fraiche", icon: <DressingIcon /> },
    { id: "chili", name: "Chili Mayo", icon: <DressingIcon /> },
    {
      id: "salsa",
      name: "Stærk Salsa",
      icon: <DressingIcon />,
    },
    { id: "remoulade", name: "Remoulade", icon: <DressingIcon /> },
    { id: "ingen", name: "Ingen", icon: <NoIcon /> },
  ];

  const breads: BreadOption[] = [
    { id: "lyst", name: "Lyst Brød", icon: <DarkBreadIcon /> },
    { id: "groft", name: "Groft Brød", icon: <DarkBreadIcon /> },
    { id: "rugbrød", name: "Rugbrød", icon: <DarkBreadIcon /> },
    { id: "glutenfri", name: "Glutenfri", icon: <DarkBreadIcon /> },
  ];

  const [selectedSandwich, setSelectedSandwich] = useState<number | null>(null);
  const [selectedBread, setSelectedBread] = useState<
    "lyst" | "rugbrød" | "groft" | "glutenfri" | null
  >(null);
  const [selectedDressing, setSelectedDressing] = useState<string | null>(null);
  const [sessionValid, setSessionValid] = useState<boolean | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [nameSubmitted, setNameSubmitted] = useState(false);

  // Validate session on mount
  useEffect(() => {
    const validateSession = async () => {
      try {
        const response = await fetch(`${API_URL}/sessions/${menuId}`);
        const data = await response.json();
        setSessionValid(data.ok);
      } catch (err) {
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
        setSubmitted(true);
      } else {
        setError(data.message || "Kunne ikke gemme ordren");
      }
    } catch (err) {
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
          router.replace("#bread");
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
