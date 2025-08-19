import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA9SFD0p1Zgf8hwnqtYlxdmPfpLd7tx-ew",
  authDomain: "rpos-d53d0.firebaseapp.com",
  databaseURL: "https://rpos-d53d0-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "rpos-d53d0",
  storageBucket: "rpos-d53d0.firebasestorage.app",
  messagingSenderId: "158319305194",
  appId: "1:158319305194:web:1113ad49178f365ce2d293",
  measurementId: "G-P9LW699SEC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);