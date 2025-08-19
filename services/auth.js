import {
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { auth } from '../firebase/config';

/**
 * Signs in a user with their email and password using Firebase Authentication.
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @returns {Promise<import("firebase/auth").User>} The authenticated user object from Firebase.
 * @throws {Error} Throws an error if authentication fails.
 */
export const loginWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    // Re-throw the error so it can be caught and handled by the calling function (in AuthContext).
    // This allows us to display specific error messages in the UI.
    throw error;
  }
};

/**
 * Signs out the currently authenticated user.
 * @returns {Promise<void>}
 * @throws {Error} Throws an error if sign-out fails.
 */
export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};

/**
 * Creates a new user in Firebase Authentication.
 * This is useful for the Admin's "Add User" feature.
 * @param {string} email The new user's email.
 * @param {string} password The new user's password.
 * @returns {Promise<import("firebase/auth").User>} The newly created user object.
 * @throws {Error} Throws an error if user creation fails.
 */
export const registerUserWithEmail = async (email, password) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        throw error;
    }
};