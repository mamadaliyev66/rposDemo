import React, { createContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore'; // 🔥 Updated
import { auth, db } from '../firebase/config';
import { loginWithEmail } from '../services/auth';

// 1. Create the context
export const AuthContext = createContext();

// 2. Create the provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('[AuthContext] Setting up Firebase auth state listener...');
    
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('[AuthContext] Auth state changed.');
      setLoading(true);
      setError(null);

      if (firebaseUser) {
        console.log(`[AuthContext] User is logged in with UID: ${firebaseUser.uid}, Email: ${firebaseUser.email}`);
        try {
          const usersRef = collection(db, 'users');
          const snapshot = await getDocs(usersRef);

          console.log(`[AuthContext] Total user docs fetched: ${snapshot.size}`);
          let matchedUserData = null;

          snapshot.forEach(doc => {
            const data = doc.data();
            console.log(`[AuthContext] Checking user doc ID ${doc.id}:`, data);

            const matchByUID = data.uid === firebaseUser.uid;
            const matchByEmail = data.email?.toLowerCase() === firebaseUser.email?.toLowerCase();

            if (matchByUID || matchByEmail) {
              console.log(`[AuthContext] Match found! doc.id: ${doc.id}`);
              matchedUserData = data;
            }
          });

          if (matchedUserData) {
            console.log(`[AuthContext] Successfully matched user. Role: ${matchedUserData.role}`);
            setUser({ ...firebaseUser, ...matchedUserData });
          } else {
            console.error(`[AuthContext] No matching user found in Firestore for UID: ${firebaseUser.uid} or email: ${firebaseUser.email}`);
            throw new Error("User data not found in the database.");
          }
        } catch (e) {
          console.error("[AuthContext] Error fetching user data:", e);
          setUser(null);
          setError(e.message);
          await signOut(auth);
        }
      } else {
        console.log('[AuthContext] User is logged out.');
        setUser(null);
      }

      setLoading(false);
    });

    return () => {
      console.log('[AuthContext] Cleaning up auth state listener.');
      unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    console.log(`[AuthContext] Attempting to log in with email: ${email}`);
    try {
      await loginWithEmail(email, password);
      // Auth state listener will handle the result
    } catch (e) {
      console.error(`[AuthContext] Login failed with Firebase error: ${e.code}`);
      switch (e.code) {
        case 'auth/user-not-found':
        case 'auth/invalid-credential':
        case 'auth/wrong-password':
          setError("Noto'g'ri email yoki parol.");
          break;
        case 'auth/invalid-email':
          setError("Email manzili noto'g'ri formatda.");
          break;
        default:
          setError("Tizimga kirishda xatolik yuz berdi.");
      }
    }
  };

  const logout = async () => {
    console.log('[AuthContext] Attempting to log out...');
    try {
      await signOut(auth);
      console.log('[AuthContext] User successfully signed out.');
    } catch (e) {
      console.error("[AuthContext] Logout failed:", e);
      setError("Tizimdan chiqishda xatolik yuz berdi.");
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    error,
    login,
    logout,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
