export const ConvertTimeStringToChatHistory = (lastActiveAt: string): string => {
  if (!lastActiveAt) return "Last active years ago"
  
  const lastActive = new Date(lastActiveAt + 'Z'), now = new Date(), timeDiff = now.getTime() - lastActive.getTime()

  const seconds = Math.floor(timeDiff / 1000),
    minutes = Math.floor(seconds / 60),
    hours = Math.floor(minutes / 60),
    days = Math.floor(hours / 24),
    weeks = Math.floor(days / 7),
    months = Math.floor(days / 30),
    years = Math.floor(days / 365)

  if (seconds < 60) return "Active now"
  if (minutes < 60) return `Last active ${minutes} minute${minutes > 1 ? 's' : ''} ago`
  if (hours < 24) return `Last active ${hours} hour${hours > 1 ? 's' : ''} ago`
  if (days < 7) return `Last active ${days} day${days > 1 ? 's' : ''} ago`
  if (weeks < 4) return `Last active ${weeks} week${weeks > 1 ? 's' : ''} ago`
  if (months < 12) return `Last active ${months} month${months > 1 ? 's' : ''} ago`
  return `Last active ${years} year${years > 1 ? 's' : ''} ago`
}
