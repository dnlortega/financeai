import Image from "next/image";
import NavbarLinks from "./navbar-links";
import NavbarRight from "./navbar-right";

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between border-b border-solid px-4 py-4 md:px-8">
      {/* ESQUERDA */}
      <div className="flex items-center gap-6 overflow-x-auto md:gap-10">
        <Image
          src="/logo.svg"
          width={173}
          height={39}
          alt="Finance AI"
          className="hidden shrink-0 md:block"
        />
        <Image
          src="/logo.svg"
          width={130}
          height={30}
          alt="Finance AI"
          className="shrink-0 md:hidden"
        />
        <NavbarLinks />
      </div>
      {/* DIREITA */}
      <NavbarRight />
    </nav>
  );
};

export default Navbar;
