"use client";

import { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
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
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [isClosing, setIsClosing] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const menuUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/menu/${sessionCode}`
      : `/menu/${sessionCode}`;

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(menuUrl)}`;

  // Preload the QR code image immediately when component mounts
  useEffect(() => {
    if (sessionCode) {
      const img = new Image();
      img.onload = () => setIsImageLoaded(true);
      img.src = qrCodeUrl;
    }
  }, [sessionCode, qrCodeUrl]);

  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
    }
    if (!isOpen) {
      setCopied(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 200);
  };

  const handleCopyLink = async (e: React.MouseEvent) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setTooltipPosition({
      x: e.clientX - rect.left,
      y: -30,
    });

    try {
      await navigator.clipboard.writeText(menuUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
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
          <img src={qrCodeUrl} alt="QR Code" className={styles.qrCode} />
        </div>

        <div className={styles.linkContainer}>
          <span className={styles.clickableLink} onClick={handleCopyLink}>
            {menuUrl}
            {copied && (
              <span
                className={styles.tooltip}
                style={{ left: tooltipPosition.x, top: tooltipPosition.y }}
              >
                Kopieret!
              </span>
            )}
          </span>
        </div>
      </div>
    </div>
  );
}
