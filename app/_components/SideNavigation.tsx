"use client";

import {
  CalendarDaysIcon,
  HomeIcon,
  UserIcon,
} from "@heroicons/react/24/solid";
import SignOutButton from "@/app/_components/SignOutButton";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  {
    name: "Home",
    href: "/account",
    icon: <HomeIcon className="h-5 w-5 text-primary-600" />,
  },
  {
    name: "Reservations",
    href: "/account/reservations",
    icon: <CalendarDaysIcon className="h-5 w-5 text-primary-600" />,
  },
  {
    name: "Guest profile",
    href: "/account/profile",
    icon: <UserIcon className="h-5 w-5 text-primary-600" />,
  },
];

function SideNavigation() {
  const pathname = usePathname();

  return (
    <nav className="border-b md:border-b-0 md:border-r border-primary-900 pb-4 md:pb-0">
      <ul className="flex md:flex-col gap-2 h-full text-sm md:text-lg overflow-x-auto whitespace-nowrap hide-scrollbar">
        {navLinks.map((link) => (
          <li key={link.name}>
            <Link
              className={`${pathname === link.href ? "bg-primary-900" : ""}  py-3 px-5 hover:bg-primary-900 hover:text-primary-100 transition-colors flex items-center gap-4 font-semibold text-primary-200`}
              href={link.href}
            >
              {link.icon}
              <span>{link.name}</span>
            </Link>
          </li>
        ))}

        <li className="md:mt-auto ml-auto md:ml-0">
          <SignOutButton />
        </li>
      </ul>
    </nav>
  );
}

export default SideNavigation;
