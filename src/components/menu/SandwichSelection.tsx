import { GiSandwich } from "react-icons/gi";
import Image from "next/image";
import styles from "@/app/(pages)/menu/[id]/menu.module.scss";

export interface Sandwich {
  id: number;
  name: string;
  description: string;
  image: string;
  hasImage?: boolean;
  noBreadDressing?: boolean;
  customIcon?: React.ReactNode;
  url?: string;
}

interface SandwichSelectionProps {
  sandwiches: Sandwich[];
  selectedSandwich: number | null;
  onSelect: (id: number) => void;
}

export default function SandwichSelection({
  sandwiches,
  selectedSandwich,
  onSelect,
}: SandwichSelectionProps) {
  return (
    <div className={styles.section}>
      <div className={styles.sandwichGrid}>
        {sandwiches.map((sandwich) => (
          <div
            key={sandwich.id}
            className={`${styles.sandwichCard} ${
              selectedSandwich === sandwich.id ? styles.selected : ""
            }`}
            onClick={() => onSelect(sandwich.id)}
          >
            <div className={styles.imageContainer}>
              {sandwich.hasImage ? (
                <Image
                  src={sandwich.image}
                  alt={sandwich.name}
                  width={100}
                  height={100}
                  className={styles.sandwichImage}
                />
              ) : (
                <div className={styles.iconContainer}>
                  {sandwich.customIcon || (
                    <span className={styles.sandwichIcon}>
                      <GiSandwich />
                    </span>
                  )}
                </div>
              )}
            </div>
            <div className={styles.sandwichInfo}>
              <h3>{sandwich.name}</h3>
              <p>{sandwich.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
