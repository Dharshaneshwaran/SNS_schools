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
        padding: scrolled ? "10px 0" : "20px 0",
        boxShadow: scrolled ? "0 10px 30px rgba(0,0,0,0.04)" : "none",
      }}
    >
      <div className="page-container">
        <nav className="header-inner" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" className="site-logo" style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: 12, 
            textDecoration: "none",
            color: "#121212",
            fontWeight: 800,
            fontFamily: "var(--font-poppins, 'Poppins', sans-serif)"
          }}>
            <div style={{ 
              width: 44, height: 44, 
              display: "flex", alignItems: "center", justifyContent: "center",
              background: "#fff",
              borderRadius: 14,
              boxShadow: "0 8px 25px rgba(0,0,0,0.06)",
              padding: 7,
              border: "1px solid rgba(0,0,0,0.04)"
            }}>
              <img 
                src="/images/logo.png" 
                alt="Logo" 
                style={{ width: "100%", height: "auto", objectFit: "contain" }} 
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <span style={{ fontSize: 24, lineHeight: 1.1 }}><span style={{ color: "#FF7F50" }}>SNS</span> <span style={{ color: "#000000" }}>Academy</span></span>
              <span style={{ 
                fontSize: 10, 
                fontWeight: 600, 
                color: "#636E72", 
                textTransform: "uppercase", 
                letterSpacing: "0.1em",
                lineHeight: 1
              }}>A Fingerprint School</span>
            </div>
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
              padding: "12px 32px", 
              fontSize: "15px", 
              fontWeight: 800,
              borderRadius: "14px",
              boxShadow: scrolled ? "0 10px 30px rgba(255,127,80,0.3)" : "0 10px 30px rgba(255,127,80,0.2)",
              background: "linear-gradient(135deg, #FF7F50 0%, #e66a3e 100%)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              color: "white",
              textDecoration: "none",
              transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
              letterSpacing: "0.02em",
              position: "relative",
              overflow: "hidden"
            }}
            onMouseEnter={(e) => { 
              e.currentTarget.style.transform = "translateY(-4px) scale(1.02)"; 
              e.currentTarget.style.boxShadow = "0 15px 35px rgba(255,127,80,0.45)"; 
            }}
            onMouseLeave={(e) => { 
              e.currentTarget.style.transform = "translateY(0) scale(1)"; 
              e.currentTarget.style.boxShadow = scrolled ? "0 10px 30px rgba(255,127,80,0.3)" : "0 10px 30px rgba(255,127,80,0.2)"; 
            }}
          >
            Login
          </Link>
        </nav>
      </div>
    </header>
  );
}
