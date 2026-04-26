"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NavbarLinks = () => {
  const pathname = usePathname();
  return (
    <div className="flex items-center gap-4 md:gap-10">
      <Link
        href="/"
        className={
          pathname === "/" ? "font-bold text-primary" : "text-muted-foreground"
        }
      >
        Dashboard
      </Link>
      <Link
        href="/transactions"
        className={
          pathname === "/transactions"
            ? "font-bold text-primary"
            : "text-muted-foreground"
        }
      >
        Transações
      </Link>
      <Link
        href="/investments"
        className={
          pathname === "/investments"
            ? "font-bold text-primary"
            : "text-muted-foreground"
        }
      >
        Investimentos
      </Link>
      <Link
        href="/subscription"
        className={
          pathname === "/subscription"
            ? "font-bold text-primary"
            : "text-muted-foreground"
        }
      >
        Assinatura
      </Link>
    </div>
  );
};

export default NavbarLinks;
