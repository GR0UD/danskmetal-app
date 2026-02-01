import { GiSandwich } from "react-icons/gi";
import { BiSolidBowlRice } from "react-icons/bi";
import { IoTrash } from "react-icons/io5";
import Image from "next/image";
import type { Order } from "@/types";
import styles from "@/app/(pages)/dashboard/dashboard.module.scss";

interface SessionCardProps {
  orders: Order[];
  onDeleteOrder?: (orderId: string) => void;
  deletingOrderId?: string | null;
}

export default function SessionCard({
  orders,
  onDeleteOrder,
  deletingOrderId,
}: SessionCardProps) {
  // Group orders by sandwich, bread, and dressing combo
  const groupedOrders = orders.reduce(
    (acc, order) => {
      const key = `${order.sandwich}|${order.bread || "Ingen brød"}|${order.dressing || "Ingen dressing"}`;
      if (!acc[key]) {
        acc[key] = {
          order,
          count: 0,
        };
      }
      acc[key].count += 1;
      return acc;
    },
    {} as Record<string, { order: Order; count: number }>,
  );

  return (
    <div className={styles.sandwichList}>
      {orders.length === 0 ? (
        <p className={styles.noOrdersInSession}>
          Ingen ordrer endnu i denne session
        </p>
      ) : (
        Object.values(groupedOrders).map((item) => {
          const order = item.order;
          const count = item.count;

          return (
            <div key={order._id} className={styles.sandwichCard}>
              <div className={styles.sandwichCardContent}>
                <a
                  href={order.url || "#"}
                  target={order.url ? "_blank" : "_self"}
                  rel={order.url ? "noopener noreferrer" : ""}
                  className={styles.sandwichCardLink}
                  onClick={(e) => {
                    if (!order.url) {
                      e.preventDefault();
                    }
                  }}
                >
                  <div className={styles.sandwichImageContainer}>
                    {order.image && order.image.trim() !== "" ? (
                      <>
                        <Image
                          src={order.image}
                          alt={order.sandwich}
                          width={80}
                          height={80}
                          className={styles.sandwichImage}
                          onError={(e) => {
                            (
                              e.currentTarget as HTMLImageElement
                            ).style.display = "none";
                          }}
                        />
                        {count > 1 && (
                          <div className={styles.quantityBadge}>{count}x</div>
                        )}
                      </>
                    ) : (
                      <>
                        <div className={styles.iconDisplay}>
                          {order.sandwich === "Pastasalat" ? (
                            <BiSolidBowlRice size={48} />
                          ) : (
                            <GiSandwich size={48} />
                          )}
                        </div>
                        {count > 1 && (
                          <div className={styles.quantityBadge}>{count}x</div>
                        )}
                      </>
                    )}
                  </div>
                  <div className={styles.sandwichCardDetails}>
                    <div className={styles.sandwichName}>{order.sandwich}</div>
                    <div className={styles.customerName}>
                      {order.customer || "Ukendt"}
                    </div>
                    <div className={styles.sandwichSpecs}>
                      <span className={styles.spec}>
                        {order.bread || "Ingen brød"}
                      </span>
                      <span className={styles.spec}>
                        {order.dressing || "Ingen dressing"}
                      </span>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
