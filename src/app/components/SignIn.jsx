"use client"
import React from "react";
import { useAuth } from "../hooks/useAuth";

const SignIn = () => {
  const { user, signInWithGoogle, signOutUser } = useAuth();

  return (
    <>
    <div className='h-32 bg-white'></div>
    <div className="flex items-center justify-center mt-4 p-4">
      {user ? (
        <div>
          <h2>Welcome, {user.displayName}</h2>
          <img src={user.photoURL} alt={user.displayName} width="100" />
          <button onClick={signOutUser} className="text-neutral-700">Sign Out</button>
        </div>
      ) : (
        <button onClick={signInWithGoogle} className="text-neutral-700">
          Sign in with Google
        </button>
      )}
    </div></>
    
  );
};

export default SignIn;
