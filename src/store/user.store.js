let user = {};
function init() {
  if (!loadUserFromLocalStorage()) {
    setUser({});
  }
}
function getUser() {
  return user;
}
function setUser(newUser, { saveToLocalStorage = true } = {}) {
  user = newUser;
  if (saveToLocalStorage) {
    saveUserToLocalStorage(user);
  }
}
function getUserRoles() {
  return user?.roles;
}
function saveUserToLocalStorage(user) {
  localStorage.setItem("user", JSON.stringify(user));
}
function loadUserFromLocalStorage() {
  const user = localStorage.getItem("user");
  if (user) {
    setUser(JSON.parse(user));
    return true;
  }
  return false;
}
function userHasRole(role) {
  if (Array.isArray(user.roles)) {
    return user.roles.includes(role);
  }
  return false;
}
export function useUserStore() {
  return {
    user,
    getUser,
    setUser,
    saveUserToLocalStorage,
    loadUserFromLocalStorage,
    init,
    getUserRoles,
    userHasRole,
  };
}