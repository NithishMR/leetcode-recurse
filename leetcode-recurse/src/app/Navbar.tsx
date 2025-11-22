"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const controlNavbar = () => {
    if (typeof window === "undefined") return;

    if (window.scrollY > lastScrollY) {
      // scrolling down → hide
      setVisible(false);
    } else {
      // scrolling up → show
      setVisible(true);
    }

    setLastScrollY(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", controlNavbar);
    return () => window.removeEventListener("scroll", controlNavbar);
  }, [lastScrollY]);

  return (
    <div
      className={` fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b transition-transform duration-300 ${
        visible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <nav className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* LOGO */}
        <Link href="/" className="text-xl font-bold text-gray-800">
          Anamnesis
        </Link>

        {/* LINKS */}
        <div className="hidden sm:flex space-x-6 text-gray-700 font-medium">
          <Link href="/dashboard" className="hover:text-blue-600">
            Dashboard
          </Link>
          <Link href="/problems" className="hover:text-blue-600">
            Add Problem
          </Link>
          <Link href="/view-problems" className="hover:text-blue-600">
            View Problems
          </Link>
          <Link href="/docs" className="hover:text-blue-600">
            Docs
          </Link>
          <Link href="/account-settings" className="hover:text-blue-600">
            Settings
          </Link>
        </div>

        {/* MOBILE MENU BUTTON (optional) */}
        <div className="sm:hidden">
          <span className="text-gray-700">☰</span>
        </div>
      </nav>
    </div>
  );
}
