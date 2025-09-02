export const GetUserOnlineStatus = (lastActiveAt: string | undefined |null): string => {
  if (!lastActiveAt) return "unavailable"

  const lastActive = new Date(lastActiveAt + 'Z'),
    now = new Date()

  const timeDiff = now.getTime() - lastActive.getTime(),
    seconds = Math.floor(timeDiff / 1000),
    minutes = Math.floor(seconds / 60)

  if (minutes < 1) return "active"
  if (minutes < 60) return "away"

  return "unavailable"
}
