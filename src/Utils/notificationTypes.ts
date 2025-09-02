enum NotificationType {
  NetworkJoinRequest = 17,
  NetworkJoinAccept = 18,
  NetworkJoinReject = 19,
  NetworkMakeAdmin = 20,
  NetworkCreatePost = 21,
  NetworkCreateAdmirer = 24,
  NetworkPostRemoved = 29,
  NetworkPostActivated = 30,
}

export function checkNotificationTypeExists(typeInt: number): boolean {
  return Object.values(NotificationType).includes(typeInt);
}
