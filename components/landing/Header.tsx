"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useEffect, useState } from "react";
import { Target } from "lucide-react";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 72,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        zIndex: 100,
        transition: "all 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
        background: scrolled ? "rgba(255, 255, 255, 0.7)" : "transparent",
        backdropFilter: scrolled ? "blur(20px) saturate(150%)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(20px) saturate(150%)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.5)" : "1px solid transparent",
        boxShadow: scrolled ? "0 4px 30px rgba(0,0,0,0.04), inset 0 -1px 0 rgba(0,0,0,0.02)" : "none",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", width: "100%" }}>
        
        {/* Logo */}
        <Link href="/home" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <img 
            src="/logo.png" 
            alt="EditalRadar Logo" 
            style={{ width: 40, height: 40, objectFit: "contain", flexShrink: 0 }} 
          />
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.5rem", color: "var(--text)", letterSpacing: "-0.03em" }}>
            Edital<span style={{ color: "var(--primary)" }}>Radar</span>
          </span>
        </Link>

        {/* Navigation & Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div className="hidden md:flex gap-8 mr-8">
            <Link href="#pricing" style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-muted)", textDecoration: "none", transition: "color 0.2s" }} className="hover:text-[var(--primary)]">Planos</Link>
          </div>
          <Link href="/dashboard">
            <Button variant="secondary" style={{ border: "none", background: "transparent", color: "var(--text)" }}>Entrar</Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="primary">Criar Conta</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
