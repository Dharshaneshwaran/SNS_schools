"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { GraduationCap } from "@phosphor-icons/react";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 w-full z-[1000] py-6 transition-all duration-400 ${scrolled ? 'header-scrolled' : ''}`}>
      <div className="container-custom">
        <nav className="flex justify-between items-center">
          <Link href="/" className="logo text-2xl font-extrabold text-accent flex items-center gap-2">
            <GraduationCap className="text-primary" size={32} weight="fill" />
            SNS <span className="text-primary">Academy ERP</span>
          </Link>
          
          <ul className="hidden md:flex gap-8 list-none">
            <li><Link href="/#about" className="font-medium hover:text-primary transition-colors">About</Link></li>
            <li><Link href="/#features" className="font-medium hover:text-primary transition-colors">Features</Link></li>
            <li><Link href="/#experience" className="font-medium hover:text-primary transition-colors">Experience</Link></li>
            <li><Link href="/#contact" className="font-medium hover:text-primary transition-colors">Contact</Link></li>
          </ul>

          <div className="header-actions">
            <Link href="/login" className="btn btn-primary">Login</Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
