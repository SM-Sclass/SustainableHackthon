// src/useAuth.js
import { useState, useEffect } from "react";
import { auth, provider, signInWithPopup, signOut } from "../utils/firebase";
import axios from "axios";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isSigningIn, setIsSigningIn] = useState(false); // Track if signing in

  const signInWithGoogle = async () => {
    if (isSigningIn) return; // Prevent multiple sign-in requests

    setIsSigningIn(true); // Set signing in status

    try {
      const result = await signInWithPopup(auth, provider);
      const userData = result.user;
      setUser(userData);

      // Send user data to the backend
      await axios.post("http://localhost:3000/users/addUser", {
        uid: userData.uid,
        displayName: userData.displayName,
        email: userData.email,
        photoURL: userData.photoURL,
      });
      setIsSigningIn(true);
    } catch (error) {
      if (error.code === "auth/cancelled-popup-request") {
        console.log("Multiple sign-in requests were made; only one was processed.");
      } else if (error.code === "auth/popup-blocked") {
        console.log("Popup was blocked. Suggest allowing popups for this site.");
      } else {
        console.error("Error during sign-in:", error);
      }
    } finally {
      setIsSigningIn(false); // Reset signing in status
    }
  };

  const signOutUser = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Error during sign-out:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return { user, signInWithGoogle, signOutUser };
};
