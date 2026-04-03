// src/context/AuthContext.js
// Provides currentUser to the whole app via React Context.
// onAuthStateChanged is the single source of truth for auth state.

import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(undefined); // undefined = loading

  useEffect(() => {
    // Firebase fires this immediately with current user (or null if logged out)
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user); // null if not logged in
    });
    return unsubscribe; // unsubscribe on unmount — prevents memory leaks
  }, []); // empty deps: set up once, Firebase handles the rest

  // undefined = still resolving; null = not logged in; object = logged in
  if (currentUser === undefined) return null; // splash / loading

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  );
}
