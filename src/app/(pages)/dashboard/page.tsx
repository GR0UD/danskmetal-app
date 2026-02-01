"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IoAdd } from "react-icons/io5";
import QRModal from "@/components/qr-modal";
import { SessionHeader, SessionCard } from "@/components/dashboard";
import { getAuthToken, deleteAuthToken } from "@/app/actions";
import type { GroupedOrder } from "@/components/dashboard";
import styles from "./dashboard.module.scss";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

interface Order {
  sandwich: string;
  bread?: string;
  dressing?: string;
  customer?: string;
  image?: string;
  url?: string;
  createdAt: string;
}

interface Session {
  _id: string;
  code: string;
  status: "active" | "closed";
  orders: Order[];
  createdAt: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSessionCode, setSelectedSessionCode] = useState("");

  const fetchSessions = async () => {
    const token = await getAuthToken();
    if (!token) {
      router.push("/");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/sessions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        await deleteAuthToken();
        router.push("/");
        return;
      }

      const data = await response.json();
      if (data.ok) {
        setSessions(data.sessions);
      }
    } catch (error) {
      console.error("Error fetching sessions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const token = await getAuthToken();
      if (!token) {
        router.push("/");
        return;
      }
      fetchSessions();
    };

    checkAuth();

    // Poll for updates every 10 seconds
    const interval = setInterval(() => fetchSessions(), 10000);
    return () => clearInterval(interval);
  }, [router]);

  const handleCreateSession = async () => {
    const token = await getAuthToken();
    if (!token) return;

    setCreating(true);
    try {
      const response = await fetch(`${API_URL}/sessions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (data.ok) {
        setSessions((prev) => [data.session, ...prev]);
        setSelectedSessionCode(data.session.code);
        setModalOpen(true);
      }
    } catch (error) {
      console.error("Error creating session:", error);
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteSession = async (code: string) => {
    const token = await getAuthToken();
    if (!token) return;

    if (!confirm("Er du sikker på, at du vil slette denne session?")) return;

    try {
      const response = await fetch(`${API_URL}/sessions/${code}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setSessions((prev) => prev.filter((s) => s.code !== code));
      }
    } catch (error) {
      console.error("Error deleting session:", error);
    }
  };

  const handleOpenQR = (code: string) => {
    setSelectedSessionCode(code);
    setModalOpen(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const months = [
      "Januar",
      "Februar",
      "Marts",
      "April",
      "Maj",
      "Juni",
      "Juli",
      "August",
      "September",
      "Oktober",
      "November",
      "December",
    ];
    return `${date.getDate()}. ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("da-DK", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  interface GroupedOrder {
    sandwich: string;
    bread?: string;
    dressing?: string;
    image?: string;
    url?: string;
    count: number;
    customers: string[];
  }

  const groupOrders = (orders: Order[]): GroupedOrder[] => {
    const groups: { [key: string]: GroupedOrder } = {};

    orders.forEach((order) => {
      const key = `${order.sandwich}|${order.bread || ""}|${order.dressing || ""}`;

      if (groups[key]) {
        groups[key].count++;
        if (order.customer) {
          groups[key].customers.push(order.customer);
        }
      } else {
        groups[key] = {
          sandwich: order.sandwich,
          bread: order.bread,
          dressing: order.dressing,
          image: order.image,
          url: order.url,
          count: 1,
          customers: order.customer ? [order.customer] : [],
        };
      }
    });

    return Object.values(groups);
  };

  if (loading) {
    return (
      <div className={styles.dashboardContainer}>
        <div className={styles.loading}>Indlæser...</div>
      </div>
    );
  }

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
        {sessions.length === 0 ? (
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
                  code={session.code}
                  status={session.status}
                  orderCount={session.orders.length}
                  uniqueCount={uniqueCount}
                  createdDate={formatDate(session.createdAt)}
                  createdTime={formatTime(session.createdAt)}
                  onQRClick={() => handleOpenQR(session.code)}
                  onDeleteClick={() => handleDeleteSession(session.code)}
                />
                <SessionCard
                  orders={groupOrders(session.orders)}
                  onQRClick={() => handleOpenQR(session.code)}
                  onDeleteClick={() => handleDeleteSession(session.code)}
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
