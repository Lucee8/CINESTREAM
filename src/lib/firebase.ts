import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore, collection, doc, getDocs, setDoc, addDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "adroit-acronym-78gvj",
  appId: "1:722450408191:web:6df0105f57232c65a822ca",
  apiKey: "AIzaSyA3fcxLqd3Qa3tqpob4yH-ydj5m27Eq_WA",
  authDomain: "adroit-acronym-78gvj.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-cinestream-1851d516-db1d-44d9-a5d0-fb04e7cdf3b3",
  storageBucket: "adroit-acronym-78gvj.firebasestorage.app",
  messagingSenderId: "722450408191"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  collection,
  doc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where
};
