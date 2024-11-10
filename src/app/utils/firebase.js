// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBldgW-4Ahhj7lKR99cePB9Y63cRjn4LPg",
  authDomain: "sustainabilityproduct-6b6b6.firebaseapp.com",
  projectId: "sustainabilityproduct-6b6b6",
  storageBucket: "sustainabilityproduct-6b6b6.firebasestorage.app",
  messagingSenderId: "776396003403",
  appId: "1:776396003403:web:8cea79d82861003e0115ce",
  measurementId: "G-V1B2RR9HXJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();