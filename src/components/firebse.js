import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { getDatabase } from "firebase/database";  // Import Realtime Database

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDJVykXMskt9hXmmjQro11B1UVJseQkTvw",
  authDomain: "shopo-6234e.firebaseapp.com",
  projectId: "shopo-6234e",
  storageBucket: "shopo-6234e.firebasestorage.app",
  messagingSenderId: "1063188297789",
  appId: "1:1063188297789:web:0c1cac3806de4c5af05254",
  measurementId: "G-ME5S1LKN6T",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const database = getDatabase(app);  // Initialize Realtime Database

export { db, app, analytics, auth, database, onAuthStateChanged, signOut };
