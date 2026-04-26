"use client";

import { UserButton } from "@clerk/nextjs";
import { ModeToggle } from "./mode-toggle";
import { useEffect, useState } from "react";

const NavbarRightInteractive = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center gap-4 shrink-0 pl-4">
        <div className="h-9 w-9" /> {/* Spacer for ModeToggle */}
        <div className="h-9 w-20" /> {/* Spacer for UserButton */}
      </div>
    );
  }

  return (
    <>
      <ModeToggle />
      <UserButton showName />
    </>
  );
};

export default NavbarRightInteractive;
