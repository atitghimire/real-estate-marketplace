// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-18460.firebaseapp.com",
  projectId: "mern-estate-18460",
  storageBucket: "mern-estate-18460.appspot.com",
  messagingSenderId: "401997786324",
  appId: "1:401997786324:web:fb09c74103fa2546921f41",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
