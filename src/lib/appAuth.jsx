import { createContext, useContext, useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';

const AppAuthContext = createContext(null);

export function AppAuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('cybersyntax_user');
    if (stored) {
      try {
        setCurrentUser(JSON.parse(stored));
      } catch (e) {
        localStorage.removeItem('cybersyntax_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, passcode) => {
    const users = await base44.entities.AppUser.filter({ email, passcode });
    if (users.length === 0) throw new Error('Invalid credentials');
    const user = users[0];
    setCurrentUser(user);
    localStorage.setItem('cybersyntax_user', JSON.stringify(user));
    return user;
  };

  const signup = async (data) => {
    const existing = await base44.entities.AppUser.filter({ email: data.email });
    if (existing.length > 0) throw new Error('Email already registered');
    const user = await base44.entities.AppUser.create(data);
    setCurrentUser(user);
    localStorage.setItem('cybersyntax_user', JSON.stringify(user));
    return user;
  };

  const updateUser = async (id, data) => {
    const updated = await base44.entities.AppUser.update(id, data);
    setCurrentUser(updated);
    localStorage.setItem('cybersyntax_user', JSON.stringify(updated));
    return updated;
  };

  const refreshUser = async () => {
    if (!currentUser) return;
    const fresh = await base44.entities.AppUser.get(currentUser.id);
    setCurrentUser(fresh);
    localStorage.setItem('cybersyntax_user', JSON.stringify(fresh));
    return fresh;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('cybersyntax_user');
  };

  return (
    <AppAuthContext.Provider value={{ currentUser, loading, login, signup, updateUser, refreshUser, logout }}>
      {children}
    </AppAuthContext.Provider>
  );
}

export const useAppAuth = () => useContext(AppAuthContext);