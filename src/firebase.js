// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBErO9ytrmS4udUHNhQEYMAhQI6xpVVYwI",
  authDomain: "finance-2e3ea.firebaseapp.com",
  projectId: "finance-2e3ea",
  storageBucket: "finance-2e3ea.appspot.com",
  messagingSenderId: "900940861607",
  appId: "1:900940861607:web:100d6eb12d0d111b098b82",
  measurementId: "G-TJFD1VYZYW",
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export { db, auth, provider, doc, setDoc };

const analytics = getAnalytics(app);
