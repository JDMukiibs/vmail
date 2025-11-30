const FRIEND_ID_KEY = "vmail:friendId";
const FRIEND_NAME_KEY = "vmail:friendName";

export function getFriendSession() {
  if (typeof window === "undefined") {
    return null;
  }

  const id = localStorage.getItem(FRIEND_ID_KEY);
  const name = localStorage.getItem(FRIEND_NAME_KEY);

  if (id && name) {
    return { id, name };
  }
  return null;
}

export function setFriendSession(id: string, name: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem(FRIEND_ID_KEY, id);
    localStorage.setItem(FRIEND_NAME_KEY, name);
  }
}

export function clearFriendSession() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(FRIEND_ID_KEY);
    localStorage.removeItem(FRIEND_NAME_KEY);
  }
}
