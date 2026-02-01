import styles from "@/app/[id]/menu.module.scss";
import type { Sandwich, DressingOption } from "./index";

interface OrderSummaryProps {
  sandwiches: Sandwich[];
  selectedSandwich: number | null;
  selectedBread: string | null;
  selectedDressing: string | null;
  dressings: DressingOption[];
  isNoBreadDressing: boolean;
  error: string;
  submitting: boolean;
  onSubmit: () => void;
}

export default function OrderSummary({
  sandwiches,
  selectedSandwich,
  selectedBread,
  selectedDressing,
  dressings,
  isNoBreadDressing,
  error,
  submitting,
  onSubmit,
}: OrderSummaryProps) {
  return (
    <>
      <div className={styles.summary}>
        <h2>Dit valg:</h2>
        {selectedSandwich ? (
          <p>
            <strong>Sandwich:</strong> {sandwiches[selectedSandwich - 1].name}
          </p>
        ) : (
          <p>
            <strong>Sandwich:</strong> Ikke valgt
          </p>
        )}
        {!isNoBreadDressing && (
          <>
            <p>
              <strong>Brødtype:</strong>{" "}
              {selectedBread ? selectedBread : "Ikke valgt"}
            </p>
            <p>
              <strong>Dressing:</strong>{" "}
              {selectedDressing
                ? dressings.find((d) => d.id === selectedDressing)?.name
                : "Ikke valgt"}
            </p>
          </>
        )}
      </div>

      {error && <div className={styles.errorText}>{error}</div>}

      <button
        className={styles.orderButton}
        onClick={onSubmit}
        disabled={submitting || !selectedSandwich}
      >
        {submitting ? "Gemmer..." : "Gem ordre"}
      </button>
    </>
  );
}
