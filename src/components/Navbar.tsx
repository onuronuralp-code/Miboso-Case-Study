"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const Navbar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="absolute top-0 left-0 right-0 z-50 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-24 items-center">
          <div className="flex-shrink-0">
            <Link 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="flex items-center"
            >
              <img src="/logo.svg" alt="Miboso Logo" className="h-10 w-auto" />
            </Link>
          </div>
          
          {/* Mobile Menu Button - Kept for structure but potentially empty if no links */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-[#2A332C]"
            >
              {!isOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M4 8h16M4 16h16" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-[#FDFBF7] animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="px-6 pt-10 pb-20 space-y-8 text-center">
            {/* Navigation links removed */}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
