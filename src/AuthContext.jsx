
import { createContext, useContext, useEffect, useState } from "react";
import { findUserByEmail, updateUser } from "./api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("libraryUser")) || null; }
    catch { return null; }
  });

  useEffect(() => {
    if (user) localStorage.setItem("libraryUser", JSON.stringify(user));
    else localStorage.removeItem("libraryUser");
  }, [user]);

  const login = async (email, password) => {
    const res = await findUserByEmail(email);
    const found = res.data[0];
    if (!found || found.password !== password) {
      throw new Error("Invalid email or password");
    }
    setUser(found);
    return found;
  };

  const logout = () => setUser(null);

  const toggleFavorite = async (bookId) => {
    if (!user) return;
    const favorites = user.favorites || [];
    const id = String(bookId);
    const next = favorites.includes(id)
      ? favorites.filter((x) => x !== id)
      : [...favorites, id];
    const updated = { ...user, favorites: next };
    setUser(updated);
    await updateUser(user.id, updated);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, toggleFavorite }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
