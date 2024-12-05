import { reactive } from "vue";

function useUserStore() {
  const state = reactive({
    user: {}
  });

  function init() {
    if (!loadUserFromLocalStorage()) {
      // Ne pas réinitialiser l'utilisateur si déjà initialisé
      if (Object.keys(state.user).length === 0) {
        setUser({});
      }
    }
  }

function getUser() {
  return state.user;
}

function setUser(newUser, { saveToLocalStorage = true } = {}) {
  state.user = newUser;
  if (saveToLocalStorage) {
    saveUserToLocalStorage(state.user);
  }
}

function userHasRole(role) {
  return Array.isArray(state.user.roles) && state.user.roles.includes(role);
}

// Vérifier si l'utilisateur est authentifié en fonction du token
function isAuthenticated() {
  return state.user?.token && !isTokenExpired(state.user.token);  // Vérifier si le token est valide et non expiré
}

// Sauvegarder l'utilisateur dans le localStorage
function saveUserToLocalStorage(user) {
  localStorage.setItem("user", JSON.stringify(user));
}

// Charger l'utilisateur depuis le localStorage
function loadUserFromLocalStorage() {
  const user = localStorage.getItem("user");
  if (user) {
    setUser(JSON.parse(user));
    return true;
  }
  return false;
}



  return {
    user: state.user,
    getUser,
    setUser,
    saveUserToLocalStorage,
    loadUserFromLocalStorage,
    init,
    userHasRole,
    isAuthenticated,
  };
}

export { useUserStore };

