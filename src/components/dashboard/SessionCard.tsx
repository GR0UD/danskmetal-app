import { GiSandwich } from "react-icons/gi";
import { BiSolidBowlRice } from "react-icons/bi";
import { IoQrCode, IoTrash } from "react-icons/io5";
import styles from "@/app/(pages)/dashboard/dashboard.module.scss";

export interface GroupedOrder {
  sandwich: string;
  bread?: string;
  dressing?: string;
  image?: string;
  url?: string;
  count: number;
  customers: string[];
}

interface SessionCardProps {
  orders: GroupedOrder[];
  onQRClick: () => void;
  onDeleteClick: () => void;
}

export default function SessionCard({
  orders,
  onQRClick,
  onDeleteClick,
}: SessionCardProps) {
  return (
    <div className={styles.sandwichList}>
      {orders.length === 0 ? (
        <p className={styles.noOrdersInSession}>
          Ingen ordrer endnu i denne session
        </p>
      ) : (
        orders.map((group, index) => (
          <a
            key={`order-group-${index}`}
            href={group.url || "#"}
            target={group.url ? "_blank" : "_self"}
            rel={group.url ? "noopener noreferrer" : ""}
            className={styles.sandwichCard}
            onClick={(e) => {
              if (!group.url) {
                e.preventDefault();
              }
            }}
          >
            <div className={styles.sandwichImageContainer}>
              <span className={styles.orderCount}>{group.count}x</span>
              {group.image && group.image.trim() !== "" ? (
                <img
                  src={group.image}
                  alt={group.sandwich}
                  className={styles.sandwichImage}
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <div className={styles.iconDisplay}>
                  {group.sandwich === "Pastasalat" ? (
                    <BiSolidBowlRice size={48} />
                  ) : (
                    <GiSandwich size={48} />
                  )}
                </div>
              )}
            </div>
            <div className={styles.sandwichCardDetails}>
              <div className={styles.sandwichName}>{group.sandwich}</div>
              <div className={styles.customerName}>
                {group.customers.length > 0
                  ? group.customers.join(", ")
                  : "Ukendt"}
              </div>
              <div className={styles.sandwichSpecs}>
                <span className={styles.spec}>
                  {group.bread || "Ingen brød"}
                </span>
                <span className={styles.spec}>
                  {group.dressing || "Ingen dressing"}
                </span>
              </div>
            </div>
          </a>
        ))
      )}
    </div>
  );
}
