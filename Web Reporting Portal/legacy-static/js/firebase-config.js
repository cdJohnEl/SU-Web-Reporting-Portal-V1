const firebaseConfig = {
  apiKey: "AIzaSyC0DLD6j0GDkyXA7utPqpm48pJ-LRuAbvo",
  authDomain: "pocketlens-6a560.firebaseapp.com",
  projectId: "pocketlens-6a560",
  storageBucket: "pocketlens-6a560.firebasestorage.app",
  messagingSenderId: "32315683782",
  appId: "1:32315683782:web:89e47ff38654f59204f8c7",
  measurementId: "G-QR5ZCMGDZ0"
};

// Initialize Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
