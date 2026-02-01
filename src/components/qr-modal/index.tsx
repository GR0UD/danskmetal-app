"use client";

import { useState } from "react";
import { IoClose } from "react-icons/io5";
import Image from "next/image";
import styles from "./qr-modal.module.scss";

interface QRModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessionCode: string;
}

export default function QRModal({
  isOpen,
  onClose,
  sessionCode,
}: QRModalProps) {
  const [copied, setCopied] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [isClosing, setIsClosing] = useState(false);

  const menuUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/${sessionCode}`
      : `/${sessionCode}`;

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(menuUrl)}`;

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      // Reset state after modal is closed
      setIsClosing(false);
      setCopied(false);
    }, 200);
  };

  const handleCopyLink = async (e: React.MouseEvent) => {
    // Get position relative to the modal
    const modal = (e.currentTarget as HTMLElement).closest(`.${styles.modal}`);
    if (modal) {
      const modalRect = modal.getBoundingClientRect();
      setTooltipPos({
        x: e.clientX - modalRect.left,
        y: e.clientY - modalRect.top - 40,
      });
    }

    try {
      // Try modern clipboard API first
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(menuUrl);
      } else {
        // Fallback for mobile/older browsers
        const textArea = document.createElement("textarea");
        textArea.value = menuUrl;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        textArea.style.top = "-9999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={`${styles.overlay} ${isClosing ? styles.closing : ""}`}
      onClick={handleClose}
    >
      <div
        className={`${styles.modal} ${isClosing ? styles.closing : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button className={styles.closeButton} onClick={handleClose}>
          <IoClose size={24} />
        </button>

        <div className={styles.qrContainer}>
          <Image
            src={qrCodeUrl}
            alt="QR Code"
            width={200}
            height={200}
            className={styles.qrCode}
            unoptimized
          />
        </div>

        <div className={styles.linkContainer}>
          <span className={styles.clickableLink} onClick={handleCopyLink}>
            {menuUrl}
          </span>
        </div>
        {copied && (
          <span
            className={styles.copiedBadge}
            style={{ left: tooltipPos.x, top: tooltipPos.y }}
          >
            Kopieret!
          </span>
        )}
      </div>
    </div>
  );
}
