export function convertTimestampToAgo(timestamp: string): string {
  const timestampDate = new Date(timestamp);
  const currentDate = new Date();

  const timeDifference = currentDate.getTime() - timestampDate.getTime();

  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days}d${days > 1 ? "" : ""} ago`;
  } else if (hours > 0) {
    return `${hours}h${hours > 1 ? "" : ""} ago`;
  } else if (minutes > 0) {
    return `${minutes}min${minutes > 1 ? "" : ""} ago`;
  } else {
    return "just now";
  }
}
