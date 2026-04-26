import { UserButton } from "@clerk/nextjs";
import NavbarAlerts from "./navbar-alerts";
import { getAlerts } from "../_data/get-alerts";
import { ModeToggle } from "./mode-toggle";

const NavbarRight = async () => {
  const now = new Date();
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const year = now.getFullYear().toString();
  
  const alerts = await getAlerts(month, year);

  return (
    <div className="flex items-center gap-4 shrink-0 pl-4">
      <NavbarAlerts alerts={alerts} />
      <ModeToggle />
      <UserButton showName />
    </div>
  );
};

export default NavbarRight;
