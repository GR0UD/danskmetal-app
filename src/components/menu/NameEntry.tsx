import styles from "@/app/(pages)/menu/[id]/menu.module.scss";

interface NameEntryProps {
  customerName: string;
  onNameChange: (name: string) => void;
  onSubmit: () => void;
}

export default function NameEntry({
  customerName,
  onNameChange,
  onSubmit,
}: NameEntryProps) {
  return (
    <div className={styles.nameEntry}>
      <h2>Velkommen!</h2>
      <p>Indtast dit navn for at bestille</p>
      <input
        type="text"
        placeholder="Dit navn"
        value={customerName}
        onChange={(e) => onNameChange(e.target.value)}
        className={styles.nameInput}
        autoFocus
      />
      <button
        className={styles.nameButton}
        onClick={onSubmit}
        disabled={!customerName.trim()}
      >
        Fortsæt
      </button>
    </div>
  );
}
