"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header 
      className={`site-header${scrolled ? " scrolled" : ""}`}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        background: scrolled ? "rgba(255, 255, 255, 0.75)" : "transparent",
        backdropFilter: scrolled ? "blur(20px) saturate(180%)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255, 255, 255, 0.3)" : "none",
        padding: scrolled ? "12px 0" : "24px 0",
        boxShadow: scrolled ? "0 10px 30px rgba(0,0,0,0.04)" : "none",
      }}
    >
      <div className="page-container">
        <nav className="header-inner" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" className="site-logo" style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: 14, 
            textDecoration: "none",
            color: "#121212",
            fontWeight: 900,
            fontSize: 24,
            letterSpacing: "-0.03em",
            fontFamily: "var(--font-poppins,'Poppins',sans-serif)"
          }}>
            <div style={{ 
              width: 44, height: 44, 
              display: "flex", alignItems: "center", justifyContent: "center",
              background: "#fff",
              borderRadius: 14,
              boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
              padding: 6,
              border: "1px solid rgba(0,0,0,0.04)"
            }}>
              <img 
                src="/images/logo.png" 
                alt="Logo" 
                style={{ width: "100%", height: "auto", objectFit: "contain" }} 
              />
            </div>
            <span>SNS <span style={{ color: "#FF7F50" }}>Academy</span></span>
          </Link>

          <ul className="header-nav" style={{ 
            display: "flex", 
            gap: 32, 
            listStyle: "none",
            margin: 0,
            padding: 0
          }}>
            {["About", "Features", "Experience", "Contact"].map((item) => (
              <li key={item}>
                <Link 
                  href={`/#${item.toLowerCase()}`}
                  style={{
                    textDecoration: "none",
                    color: "#636E72",
                    fontWeight: 600,
                    fontSize: 15,
                    transition: "color 0.2s",
                    fontFamily: "var(--font-inter,'Inter',sans-serif)"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = "#FF7F50"}
                  onMouseLeave={(e) => e.currentTarget.style.color = "#636E72"}
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>

          <Link 
            href="/login" 
            className="btn btn-primary" 
            style={{ 
              padding: "12px 28px", 
              fontSize: "14px", 
              fontWeight: 800,
              borderRadius: 16,
              boxShadow: "0 10px 25px rgba(255,127,80,0.25)",
              background: "linear-gradient(135deg, #FF7F50, #e66a3e)",
              border: "none",
              color: "white",
              textDecoration: "none",
              transition: "all 0.3s"
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 15px 30px rgba(255,127,80,0.35)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 10px 25px rgba(255,127,80,0.25)"; }}
          >
            Login
          </Link>
        </nav>
      </div>
    </header>
  );
}
