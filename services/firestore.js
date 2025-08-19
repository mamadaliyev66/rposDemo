import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

/**
 * Fetches a user's profile data from the 'users' collection in Firestore.
 * @param {string} uid - The user's unique ID.
 * @returns {Promise<object|null>} The user's data object if found, otherwise null.
 */
export const getUserData = async (uid) => {
  if (!uid) return null;
  try {
    const userDocRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      return userDoc.data();
    } else {
      console.warn("No user document found for UID:", uid);
      return null;
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    // Re-throw the error to be handled by the caller (e.g., AuthContext)
    throw new Error("Could not fetch user profile.");
  }
};

/**
 * Creates a new user profile document in the 'users' collection.
 * This is typically called after a user is successfully created in Firebase Auth.
 * @param {string} uid - The new user's unique ID from Firebase Auth.
 * @param {object} data - The user profile data (e.g., { displayName, email, role, createdAt }).
 * @returns {Promise<void>}
 */
export const createUserProfile = async (uid, data) => {
    if (!uid || !data) throw new Error("UID and user data are required.");
    try {
        const userDocRef = doc(db, 'users', uid);
        // Using setDoc will create the document or overwrite it if it already exists.
        await setDoc(userDocRef, data);
    } catch (error) {
        console.error("Error creating user profile:", error);
        throw new Error("Could not create user profile.");
    }
};

// You can add more specific Firestore interactions here as your app grows.
// For example, a function to get a single order's details:
/*
export const getOrderById = async (orderId) => {
    // ... logic to fetch a single order
}
*/