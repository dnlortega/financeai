"use client";

import { BellIcon } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Alert } from "../_data/get-alerts";

interface NavbarAlertsProps {
  alerts: Alert[];
}

const NavbarAlerts = ({ alerts }: NavbarAlertsProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <BellIcon />
          {alerts.length > 0 && (
            <span className="absolute right-2 top-2 flex h-2 w-2 rounded-full bg-red-500"></span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Notificações</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {alerts.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            Nenhuma notificação por enquanto.
          </div>
        ) : (
          alerts.map((alert) => (
            <DropdownMenuItem key={alert.id} className="flex flex-col items-start p-3">
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${
                  alert.type === "danger" ? "bg-red-500" : 
                  alert.type === "warning" ? "bg-yellow-500" : "bg-blue-500"
                }`} />
                <span className="font-bold">{alert.title}</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {alert.description}
              </p>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NavbarAlerts;
