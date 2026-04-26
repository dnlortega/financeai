"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboardIcon, 
  ArrowLeftRightIcon, 
  TrendingUpIcon, 
  TargetIcon,
  CreditCardIcon
} from "lucide-react";

const BottomNav = () => {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Início", icon: LayoutDashboardIcon },
    { href: "/transactions", label: "Transações", icon: ArrowLeftRightIcon },
    { href: "/investments", label: "Investir", icon: TrendingUpIcon },
    { href: "/budgets", label: "Limites", icon: TargetIcon },
    { href: "/subscription", label: "Premium", icon: CreditCardIcon },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t bg-background/80 backdrop-blur-md pb-safe-offset-2 pt-2 md:hidden">
      {links.map((link) => {
        const Icon = link.icon;
        const isActive = pathname === link.href;
        
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex flex-col items-center gap-1 transition-colors ${
              isActive ? "text-primary" : "text-muted-foreground opacity-70"
            }`}
          >
            <Icon size={20} />
            <span className="text-[10px] font-medium">{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default BottomNav;
