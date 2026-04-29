"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { GraduationCap } from "@phosphor-icons/react";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`site-header${scrolled ? " scrolled" : ""}`}>
      <div className="page-container">
        <nav className="header-inner">
          <Link href="/" className="site-logo">
            <GraduationCap size={30} weight="fill" color="#FF7F50" />
            SNS <span>Academy ERP</span>
          </Link>

          <ul className="header-nav">
            <li><Link href="/#about">About</Link></li>
            <li><Link href="/#features">Features</Link></li>
            <li><Link href="/#experience">Experience</Link></li>
            <li><Link href="/#contact">Contact</Link></li>
          </ul>

          <Link href="/login" className="btn btn-primary" style={{ padding: "0.65rem 1.5rem", fontSize: "0.9rem" }}>
            Login
          </Link>
        </nav>
      </div>
    </header>
  );
}
