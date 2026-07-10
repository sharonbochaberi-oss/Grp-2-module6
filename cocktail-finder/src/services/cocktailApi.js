const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:4000"
    : "");
export const BASE_URL = API_BASE_URL === "/api" ? "" : API_BASE_URL.replace(/\/$/, "");

function getToken() {
  return localStorage.getItem("token");
}

function authHeaders(extra = {}) {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}`, ...extra } : { ...extra };
}

function buildUrl(path) {
  return `${BASE_URL}${path}`;
}

async function fetchJson(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: { ...authHeaders(), ...options.headers },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error ${res.status}: ${text}`);
  }
  return res.status === 204 ? null : res.json();
}

export const fetchCocktails = async (search = "") => {
  const query = search ? `?search=${encodeURIComponent(search)}` : "";
  return fetchJson(buildUrl(`/api/cocktails/${query}`));
};

export const getCocktailById = async (id) => {
  return fetchJson(buildUrl(`/api/cocktails/${id}`));
};

export const createCocktail = async (cocktail) => {
  return fetchJson(buildUrl(`/api/cocktails/`), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cocktail),
  });
};

export const updateCocktail = async (id, cocktail) => {
  return fetchJson(buildUrl(`/api/cocktails/${id}`), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cocktail),
  });
};

export const deleteCocktail = async (id) => {
  return fetchJson(buildUrl(`/api/cocktails/${id}`), {
    method: "DELETE",
  });
};

export const getCocktailNotes = async (cocktailId) => {
  return fetchJson(buildUrl(`/api/cocktails/${cocktailId}/notes`));
};

export const createNote = async (cocktailId, text) => {
  return fetchJson(buildUrl(`/api/cocktails/${cocktailId}/notes`), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
};

export const updateNote = async (noteId, text) => {
  return fetchJson(buildUrl(`/api/notes/${noteId}`), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
};

export const deleteNote = async (noteId) => {
  return fetchJson(buildUrl(`/api/notes/${noteId}`), {
    method: "DELETE",
  });
};

export const getFavorites = async () => {
  return fetchJson(buildUrl(`/api/favorites`));
};

export const addFavorite = async (cocktailId, category = "General") => {
  return fetchJson(buildUrl(`/api/favorites`), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cocktailId, category }),
  });
};

export const deleteFavorite = async (favoriteId) => {
  return fetchJson(buildUrl(`/api/favorites/${favoriteId}`), {
    method: "DELETE",
  });
};
