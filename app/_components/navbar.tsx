"use client";

import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const pathname = usePathname();
  return (
    <nav className="flex items-center justify-between border-b border-solid px-4 py-4 md:px-8">
      {/* ESQUERDA */}
      <div className="flex items-center gap-6 overflow-x-auto md:gap-10">
        <Image src="/logo.svg" width={173} height={39} alt="Finance AI" className="hidden shrink-0 md:block" />
        <Image src="/logo.svg" width={130} height={30} alt="Finance AI" className="shrink-0 md:hidden" />
        <div className="flex items-center gap-4 md:gap-10">
          <Link
            href="/"
            className={
              pathname === "/"
                ? "font-bold text-primary"
                : "text-muted-foreground"
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
      </div>
      {/* DIREITA */}
      <div className="shrink-0 pl-4">
        <UserButton showName />
      </div>
    </nav>
  );
};

export default Navbar;
