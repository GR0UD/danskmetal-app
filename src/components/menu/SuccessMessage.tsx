import { IoCheckmarkCircle } from "react-icons/io5";
import styles from "@/app/(pages)/menu/[id]/menu.module.scss";

interface SuccessMessageProps {
  customerName: string;
}

export default function SuccessMessage({ customerName }: SuccessMessageProps) {
  return (
    <div className={styles.successMessage}>
      <IoCheckmarkCircle size={64} />
      <h2>Tak, {customerName}!</h2>
      <p>Din bestilling er blevet modtaget.</p>
      <p className={styles.pickupTime}>Der er mad kl. 12:00 / 12:30</p>
    </div>
  );
}
