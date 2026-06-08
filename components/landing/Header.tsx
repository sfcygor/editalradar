"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useEffect, useState } from "react";
import { logoutAction } from "@/lib/actions/auth";
import { useAuthModal } from "@/components/auth/AuthModalProvider";
import { motion } from "framer-motion";

const SPRING = { type: "spring", stiffness: 320, damping: 28 } as const;

export default function Header({ user }: { user?: any }) {
  const [scrolled, setScrolled] = useState(false);
  const { openLogin, openRegister } = useAuthModal();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 68,
        display: "flex",
        alignItems: "center",
        zIndex: 100,
        transition: "all 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
        background: scrolled ? "rgba(255,255,255,0.78)" : "transparent",
        backdropFilter: scrolled ? "blur(20px) saturate(160%)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(20px) saturate(160%)" : "none",
        boxShadow: scrolled
          ? "0 1px 0 rgba(0,0,0,0.055), 0 4px 24px rgba(0,0,0,0.03)"
          : "none",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 clamp(16px, 3vw, 32px)",
          width: "100%",
        }}
      >
        {/* Logo */}
        <Link href="/home" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <motion.div whileHover={{ scale: 1.05 }} transition={SPRING}>
            <img
              src="/logo.png"
              alt="EditalRadar Logo"
              style={{ width: 38, height: 38, objectFit: "contain", flexShrink: 0 }}
            />
          </motion.div>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "1.4rem",
              color: "#0f172a",
              letterSpacing: "-0.035em",
            }}
          >
            Edital<span style={{ color: "#10b981" }}>Radar</span>
          </span>
        </Link>

        {/* Nav + Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* Nav links — hidden on small screens */}
          <nav
            className="hidden md:flex"
            style={{ display: "flex", gap: 28, marginRight: 16 }}
          >
            {[
              { href: "/home#pricing", label: "Planos" },
              { href: "/suporte", label: "Fale Conosco" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: "#64748b",
                  textDecoration: "none",
                  transition: "color 0.2s ease",
                  padding: "4px 0",
                }}
                className="hover:text-[#10b981]"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Auth buttons */}
          {user ? (
            <>
              <Link href="/dashboard">
                <motion.div whileHover={{ scale: 1.04, y: -1 }} whileTap={{ scale: 0.97 }} transition={SPRING}>
                  <Button variant="primary">Acessar Área</Button>
                </motion.div>
              </Link>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} transition={SPRING}>
                <Button
                  variant="secondary"
                  onClick={() => logoutAction()}
                  style={{ border: "none", background: "transparent", color: "#64748b" }}
                >
                  Sair
                </Button>
              </motion.div>
            </>
          ) : (
            <>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} transition={SPRING}>
                <Button
                  variant="secondary"
                  onClick={openLogin}
                  style={{ border: "none", background: "transparent", color: "#64748b", fontSize: "0.9rem" }}
                >
                  Entrar
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.04, y: -1 }} whileTap={{ scale: 0.97 }} transition={SPRING}>
                <Button
                  variant="primary"
                  onClick={openRegister}
                  style={{
                    fontSize: "0.9rem",
                    boxShadow: "0 4px 14px rgba(16,185,129,0.25)",
                  }}
                >
                  Criar Conta
                </Button>
              </motion.div>
            </>
          )}
        </div>
      </div>
    </motion.header>
  );
}
