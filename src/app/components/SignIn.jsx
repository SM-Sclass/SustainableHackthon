"use client"
import React from "react";
import { useAuth } from "../hooks/useAuth";

const SignIn = () => {
  const { user, signInWithGoogle, signOutUser } = useAuth();

  return (
    <>
    <div className='h-32 bg-white'></div>
    <div className="flex items-center justify-center mt-4 p-4 bg-[rgb(1,78,157)] hover:bg-[rgb(69,122,175)] rounded-md">
      {user ? (
        <div className="flex flex-col items-center justify-center">
          <h2>Welcome, {user.displayName}</h2>
          <button onClick={signOutUser} className="text-white font-bold">Sign Out</button>
        </div>
      ) : (
        <button onClick={signInWithGoogle} className="text-white">
          Sign in with Google
        </button>
      )}
    </div></>
    
  );
};

export default SignIn;
