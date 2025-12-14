"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const controlNavbar = () => {
    if (typeof window === "undefined") return;

    if (window.scrollY > lastScrollY) {
      setVisible(false); // scrolling down → hide
    } else {
      setVisible(true); // scrolling up → show
    }

    setLastScrollY(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", controlNavbar);
    return () => window.removeEventListener("scroll", controlNavbar);
  }, [lastScrollY]);

  return (
    <div
      className={`
        fixed top-0 left-0 right-0 z-50
        transition-transform duration-300
        ${visible ? "translate-y-0" : "-translate-y-full"}

        bg-white border-b border-gray-200 shadow-sm
        dark:bg-[#0d0d0d] dark:border-[#262626] dark:shadow-none
      `}
    >
      <nav className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* LOGO */}
        <Link
          href="/"
          className="
            text-xl font-bold
            text-gray-800
            dark:text-gray-100
          "
        >
          Anamnesis
        </Link>

        {/* LINKS */}
        <div
          className="
            hidden sm:flex space-x-6 font-medium
            text-gray-700
            dark:text-gray-300
          "
        >
          <Link
            href="/dashboard"
            className="hover:text-blue-600 dark:hover:text-blue-400"
          >
            Dashboard
          </Link>

          <Link
            href="/problems"
            className="hover:text-blue-600 dark:hover:text-blue-400"
          >
            Add Problem
          </Link>

          <Link
            href="/view-problems"
            className="hover:text-blue-600 dark:hover:text-blue-400"
          >
            View Problems
          </Link>

          <Link
            href="/docs"
            className="hover:text-blue-600 dark:hover:text-blue-400"
          >
            Docs
          </Link>

          <Link
            href="/account-settings"
            className="hover:text-blue-600 dark:hover:text-blue-400"
          >
            Settings
          </Link>
        </div>

        {/* MOBILE MENU ICON */}
        <div className="sm:hidden text-gray-700 dark:text-gray-300">☰</div>
      </nav>
    </div>
  );
}
