import { IoCheckmarkCircle } from "react-icons/io5";
import { IoTrash } from "react-icons/io5";
import Image from "next/image";
import styles from "@/styles/pages/menu.module.scss";

interface OrderInfo {
  sandwich: string;
  bread?: string;
  dressing?: string;
  image?: string;
}

interface SuccessMessageProps {
  customerName: string;
  order?: OrderInfo;
  onDelete?: () => void;
  isDeleting?: boolean;
}

export default function SuccessMessage({
  customerName,
  order,
  onDelete,
  isDeleting = false,
}: SuccessMessageProps) {
  return (
    <div className={styles.successMessage}>
      <IoCheckmarkCircle size={64} />
      <h2>Tak{customerName ? `, ${customerName}` : ""}!</h2>
      <p>Din bestilling er blevet modtaget.</p>

      <p className={styles.pickupTime}>Der er mad kl. 12:00 / 12:30</p>

      {order && (
        <div className={styles.orderSummaryDisplay}>
          {order.image && (
            <div className={styles.orderImageContainer}>
              <Image
                src={order.image}
                alt={order.sandwich}
                width={150}
                height={150}
              />
            </div>
          )}
          <div className={styles.orderDetailsDisplay}>
            <p className={styles.orderSandwich}>{order.sandwich}</p>
            {order.bread && (
              <p className={styles.orderSpec}>Brød: {order.bread}</p>
            )}
            {order.dressing && (
              <p className={styles.orderSpec}>Dressing: {order.dressing}</p>
            )}
          </div>
        </div>
      )}

      {onDelete && (
        <button
          className={styles.deleteOrderButton}
          onClick={onDelete}
          disabled={isDeleting}
          title="Slet din ordre og start forfra"
        >
          <IoTrash size={18} />
          {isDeleting ? "Sletter..." : "Slet min ordre"}
        </button>
      )}
    </div>
  );
}
