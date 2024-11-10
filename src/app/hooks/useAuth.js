// src/useAuth.js
import { useState, useEffect } from "react";
import { signInWithPopup, signOut } from "firebase/auth";
import { auth, provider } from "../utils/firebase";
import { onAuthStateChanged } from "firebase/auth";
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
      console.log(userData);
      // Send user data to the backend
      await fetch("http://localhost:3000/api/addUser", {
        method: "POST", // Set the method to POST
        headers: {
          "Content-Type": "application/json", // Set the content type to JSON
        },
        body: JSON.stringify({
          uid: userData.uid,
          displayName: userData.displayName,
          email: userData.email,
          photoURL: userData.photoURL,
        }), // Convert the data to a JSON string
      })
        .then((response) => response.json()) // Parse the response as JSON
        .then((data) => console.log("Success:", data)) // Handle success
        .catch((error) => console.error("Error:", error)); 
        
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
    const unsubscribe = onAuthStateChanged(auth,(currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return { user, signInWithGoogle, signOutUser };
};
