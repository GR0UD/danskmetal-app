"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { IoAdd } from "react-icons/io5";
import QRModal from "@/components/qr-modal";
import { SessionHeader, SessionCard } from "@/components/dashboard";
import LoadingSkeleton from "@/components/loading-skeleton";
import { getAuthToken } from "@/app/actions";
import { useApi } from "@/hooks/useApi";
import { useDate } from "@/hooks/useDate";
import type { Session } from "@/types";
import styles from "./dashboard.module.scss";

export default function DashboardPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [deletingCode, setDeletingCode] = useState<string | null>(null);
  const [deletingOrderId, setDeletingOrderId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSessionCode, setSelectedSessionCode] = useState("");
  const { fetchApi } = useApi();
  const { formatDate, formatTime } = useDate();

  const fetchSessions = useCallback(async () => {
    const { data, ok } = await fetchApi<{ ok: boolean; sessions: Session[] }>(
      "/sessions",
      { requireAuth: true },
    );

    if (ok && data) {
      setSessions(data.sessions);
    }
    setLoading(false);
  }, [fetchApi]);

  useEffect(() => {
    const checkAuthAndFetch = async () => {
      const token = await getAuthToken();
      if (!token) {
        router.replace("/");
        return;
      }
      fetchSessions();
    };

    checkAuthAndFetch();

    // Poll for updates every 10 seconds
    const interval = setInterval(fetchSessions, 10000);
    return () => clearInterval(interval);
  }, [router, fetchSessions]);

  const handleCreateSession = async () => {
    setCreating(true);

    const { data, ok, error } = await fetchApi<{
      ok: boolean;
      session: Session;
    }>("/sessions", {
      method: "POST",
      requireAuth: true,
      showErrorToast: true,
    });

    if (ok && data) {
      setSessions((prev) => [data.session, ...prev]);
      setSelectedSessionCode(data.session.code);
      setModalOpen(true);
    } else {
      console.error("Failed to create session:", error);
    }

    setCreating(false);
  };

  const handleDeleteSession = async (code: string) => {
    if (!confirm("Er du sikker på, at du vil slette denne session?")) return;

    setDeletingCode(code);

    const { ok } = await fetchApi(`/sessions/${code}`, {
      method: "DELETE",
      requireAuth: true,
    });

    if (ok) {
      setSessions((prev) => prev.filter((s) => s.code !== code));
    }

    setDeletingCode(null);
  };

  const handleOpenQR = (code: string) => {
    setSelectedSessionCode(code);
    setModalOpen(true);
  };

  const handleDeleteOrder = async (sessionCode: string, orderId: string) => {
    setDeletingOrderId(orderId);

    const { ok } = await fetchApi(
      `/sessions/${sessionCode}/orders/${orderId}`,
      {
        method: "DELETE",
        requireAuth: true,
      },
    );

    if (ok) {
      setSessions((prev) =>
        prev.map((session) =>
          session.code === sessionCode
            ? {
                ...session,
                orders: session.orders.filter((o) => o._id !== orderId),
              }
            : session,
        ),
      );
    }

    setDeletingOrderId(null);
  };

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.header}>
        <h1 className={styles.pageTitle}>Menu Sessioner</h1>
        <button
          className={styles.createButton}
          onClick={handleCreateSession}
          disabled={creating}
        >
          <IoAdd size={24} />
        </button>
      </div>

      <div className={styles.menusGrid}>
        {loading ? (
          <LoadingSkeleton variant="session" count={2} />
        ) : sessions.length === 0 ? (
          <p className={styles.noOrders}>
            Ingen sessioner endnu. Klik på
            <span className={styles.indicator}>+</span> for at oprette en.
          </p>
        ) : (
          sessions.map((session) => {
            const uniqueCount = Object.keys(
              session.orders.reduce(
                (acc: { [key: string]: boolean }, order) => {
                  acc[`${order.sandwich}|${order.bread}|${order.dressing}`] =
                    true;
                  return acc;
                },
                {},
              ),
            ).length;

            return (
              <details key={session._id} className={styles.menuCard}>
                <SessionHeader
                  status={session.status}
                  orderCount={session.orders.length}
                  uniqueCount={uniqueCount}
                  createdDate={formatDate(session.createdAt)}
                  createdTime={formatTime(session.createdAt)}
                  onQRClick={() => handleOpenQR(session.code)}
                  onDeleteClick={() => handleDeleteSession(session.code)}
                  isDeleting={deletingCode === session.code}
                />
                <SessionCard
                  orders={session.orders}
                  onDeleteOrder={(orderId) =>
                    handleDeleteOrder(session.code, orderId)
                  }
                  deletingOrderId={deletingOrderId}
                />
              </details>
            );
          })
        )}
      </div>

      <QRModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        sessionCode={selectedSessionCode}
      />
    </div>
  );
}
