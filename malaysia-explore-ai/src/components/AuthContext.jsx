import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('auth_token'));
  const [user, setUser]   = useState(() => {
    const raw = localStorage.getItem('auth_user');
    try { return raw ? JSON.parse(raw) : null; } catch { return null; }
  });

  const login = (tok, usr=null) => {
    localStorage.setItem('auth_token', tok);
    if (usr) localStorage.setItem('auth_user', JSON.stringify(usr));
    setToken(tok);
    setUser(usr);
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    setToken(null);
    setUser(null);
  };

  const value = { token, user, login, logout, isAuthed: !!token };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
