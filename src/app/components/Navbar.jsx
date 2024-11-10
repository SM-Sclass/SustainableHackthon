"use client";
import React, { useState, useEffect } from "react";
import { Menu, MenuItem } from "./ui/navbar-menu";
import { cn } from "../utils/cn";
import Link from "next/link";
import { auth } from '../utils/firebase'; // Firebase authentication import

function Navbar({ className }) {
  const [active, setActive] = useState(null);
  const [user, setUser] = useState(null);


  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user); // If user is authenticated, store user data
      } else {
        setUser(null); // If no user, set user state to null
      }
    });

    return () => unsubscribe(); // Cleanup the listener on component unmount
  }, []);

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      setUser(null); // Update state after sign-out // Redirect to SignIn page after sign-out
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className={cn("fixed top-7 inset-x-0 max-w-2xl mx-auto z-50 shadow-lg bg-white rounded-full font-light", className)}>
      <Menu setActive={setActive}>
        <Link href={"/"}>
          <MenuItem setActive={setActive} active={active} item="Home" />
        </Link>
        <Link href={"/Recommendation"}>
          <MenuItem setActive={setActive} active={active} item="Recommendation" />
        </Link>
        <Link href={"/Brands"}>
          <MenuItem setActive={setActive} active={active} item="Brands" />
        </Link>
        {user ? (
          <button onClick={handleSignOut} className="text-blue-500">
            <MenuItem setActive={setActive} active={active} item="Sign Out" />
          </button>
        ) : (
          <Link href={"/authFirebase"}>
            <MenuItem setActive={setActive} active={active} item="Sign In" />
          </Link>
        )}
      </Menu>
    </div>
  );
}

export default Navbar;
