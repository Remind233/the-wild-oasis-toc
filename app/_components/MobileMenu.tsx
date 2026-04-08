"use client";

import { useState } from "react";
import Link from "next/link";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import UserAvatar from "./UserAvatar";
import { type Session } from "next-auth";

export default function MobileMenu({ session }: { session: Session | null }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden z-50">
      <button onClick={() => setIsOpen(true)} className="p-2">
        <Bars3Icon className="w-8 h-8 text-primary-300" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-primary-950/95 backdrop-blur-md flex flex-col items-center justify-center">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-6 right-6 p-2"
          >
            <XMarkIcon className="w-10 h-10 text-primary-300" />
          </button>

          <ul className="flex flex-col gap-10 items-center text-3xl">
            <li>
              <Link
                href="/cabins"
                className="hover:text-accent-400 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Cabins
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="hover:text-accent-400 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                About
              </Link>
            </li>
            <li>
              {session?.user?.image ? (
                <Link
                  href="/account"
                  className="hover:text-accent-400 transition-colors flex items-center gap-4"
                  onClick={() => setIsOpen(false)}
                >
                  <UserAvatar user={session.user} />
                  <span>Guest area</span>
                </Link>
              ) : (
                <Link
                  href="/account"
                  className="hover:text-accent-400 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Guest area
                </Link>
              )}
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
