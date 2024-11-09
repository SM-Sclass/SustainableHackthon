"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
const transition = {
  type: "spring",
  mass: 0.5,
  damping: 11.5,
  stiffness: 100,
  restDelta: 0.001,
  restSpeed: 0.001,
};

export const MenuItem = ({
  setActive,
  active,
  item,
  href,
  children
}) => {
  const pathname = usePathname(); 
  const isActivePage = pathname === href;
  
  return (
    (<div onMouseEnter={() => setActive(item)} className="relative ">
      <motion.p
        transition={{ duration: 0.3 }}
        className={`cursor-pointer text-black dark:text-white hover:opacity-[0.9] 
          ${isActivePage || active === item ? "border-b-2 border-yellow-400 font-medium" : "border-b-2 border-transparent"}`}>
        {item}
      </motion.p>
      {active !== null && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={transition}>
          {active === item && (
            <div
              className="absolute top-[calc(100%_+_1.2rem)] left-1/2 transform -translate-x-1/2 pt-4">
              <motion.div
                transition={transition}
                // layoutId ensures smooth animation
                layoutId="active"
                className="bg-white dark:bg-black backdrop-blur-sm rounded-2xl overflow-hidden border border-black/[0.2] dark:border-white/[0.2] shadow-xl">
                <motion.div
                  // layout ensures smooth animation
                  layout
                  className="w-max h-full p-4">
                  {children}
                </motion.div>
              </motion.div>
            </div>
          )}
        </motion.div>
      )}
    </div>)
  );
};

export const Menu = ({
  setActive,
  children
}) => {
  return (
    (<nav
      // resets the state
      onMouseLeave={() => setActive(null)}
      className="relative rounded-full border border-transparent dark:bg-black dark:border-white/[0.2] bg-white shadow-input flex justify-center space-x-4 px-8 py-6 ">
      {children}
    </nav>)
  );
};

export const HoveredLink = ({
  children,
  ...rest
}) => {
  return (
    (<Link
      {...rest}
      className="text-neutral-700 dark:text-neutral-200 border-b-2 border-transparent hover:border-yellow-400 transition duration-200">
      {children}
    </Link>)
  );
};
