import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB9cQFVGuh8QvISYX-yXprQ6EhiQi8gKvs",
  authDomain: "nwitter-reloaded-6f5e6.firebaseapp.com",
  projectId: "nwitter-reloaded-6f5e6",
  storageBucket: "nwitter-reloaded-6f5e6.firebasestorage.app",
  messagingSenderId: "714004378135",
  appId: "1:714004378135:web:09a0047d28b6412d77a252"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app)