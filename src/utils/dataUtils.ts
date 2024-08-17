export enum FormatType {
  DAY,
  DAY_TIME,
  DAY_TIME_SECONDS,
}

export const formatUnixTimestamp = (timestamp: number, type: FormatType): string => {
  const date = new Date(timestamp * 1000); // Convert to milliseconds
  switch (type) {
    case FormatType.DAY:
      return date.toLocaleDateString("de-DE", {
        year: "numeric",
        month: "2-digit",
        day: "numeric",
      });
    case FormatType.DAY_TIME:
      return date.toLocaleDateString("de-DE", {
        year: "numeric",
        month: "2-digit",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    case FormatType.DAY_TIME_SECONDS:
      return date.toLocaleDateString("de-DE", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    default:
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
  }
};
