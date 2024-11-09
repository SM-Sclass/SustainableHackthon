"use client";
import React, { useState } from "react";
import { Menu, MenuItem, HoveredLink } from "./ui/navbar-menu";
import { cn } from "../utils/cn";
import Link from "next/link";

function Navbar({ className }) {
    const [active, setActive] = useState(null);
    
    return (
        <div 
            className={cn("fixed top-7 inset-x-0 max-w-2xl mx-auto z-50 shadow-lg bg-white rounded-full font-light", className)} 
        >
            <Menu setActive={setActive}>
                <Link href={"/"}>
                    <MenuItem setActive={setActive} active={active} item="Home" href="/">
                    </MenuItem>
                </Link>
                <Link href={"/Recommendation"}>
                    <MenuItem setActive={setActive} active={active} item="Recommendation" href="/Recommendation">
                    </MenuItem>
                </Link>
                <Link href={"/Brands"}>
                    <MenuItem setActive={setActive} active={active} item="Brands" href="/Brands">
                    </MenuItem>
                </Link>
                
                <MenuItem setActive={setActive} active={active} item="Settings" href="">
                    <div className="flex flex-col space-y-4 text-sm">
                        <HoveredLink href="/Bookmark">Bookmark</HoveredLink>
                        <HoveredLink href="/Logout">Logout</HoveredLink>
                    </div>
                </MenuItem>
            </Menu>
        </div>

    )
    ;
}

export default Navbar;
