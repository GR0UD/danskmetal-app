"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "react-toastify";
import { setAuthToken, getAuthToken } from "./actions";
import styles from "./login.module.scss";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
const PIN_LENGTH = 4;

export default function Home() {
  const [pin, setPin] = useState<string[]>(Array(PIN_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const router = useRouter();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await getAuthToken();
      if (token) {
        router.replace("/dashboard");
      } else {
        setChecking(false);
      }
    };
    checkAuth();
  }, [router]);

  const handlePinChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;

    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    // Auto-focus next input
    if (value && index < PIN_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all digits are entered
    if (value && index === PIN_LENGTH - 1 && newPin.every((digit) => digit)) {
      handleLogin(newPin.join(""));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, PIN_LENGTH);
    if (!/^\d+$/.test(pastedData)) return;

    const newPin = [...pin];
    pastedData.split("").forEach((digit, i) => {
      if (i < PIN_LENGTH) newPin[i] = digit;
    });
    setPin(newPin);

    if (newPin.every((digit) => digit)) {
      handleLogin(newPin.join(""));
    }
  };

  const handleLogin = async (pinCode: string) => {
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password: pinCode }),
      });

      const data = await response.json();

      if (data.ok && data.token) {
        await setAuthToken(data.token);
        router.push("/dashboard");
      } else {
        toast.error("Forkert Pinkode");
        setPin(Array(PIN_LENGTH).fill(""));
        inputRefs.current[0]?.focus();
      }
    } catch {
      toast.error("Kunne ikke forbinde til serveren");
      setPin(Array(PIN_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return null;
  }

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginForm}>
        <div className={styles.faviconContainer}>
          <Image
            src="/favicon.ico"
            alt="Logo"
            width={48}
            height={48}
            className={styles.favicon}
          />
        </div>
        <div className={styles.pinContainer}>
          {pin.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              value={digit}
              onChange={(e) => handlePinChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : undefined}
              className={styles.pinInput}
              disabled={loading}
              autoFocus={index === 0}
            />
          ))}
        </div>
        {loading && <div className={styles.loadingText}>Logger ind...</div>}
      </div>
    </div>
  );
}
