import { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [official, setOfficial] = useState(() => {
    const stored = localStorage.getItem('official');
    return stored ? JSON.parse(stored) : null;
  });

  const login = useCallback((data) => {
    // data: { token, name, ward, role }
    localStorage.setItem('token', data.token);
    localStorage.setItem('official', JSON.stringify(data));
    setOfficial(data);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('official');
    setOfficial(null);
  }, []);

  return (
    <AuthContext.Provider value={{ official, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}