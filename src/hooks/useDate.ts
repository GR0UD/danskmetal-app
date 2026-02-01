export function useDate() {
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

  return { formatDate, formatTime };
}
