"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useRef } from "react";

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Tilted 3D effect that straightens out as you scroll down
  const rotateX = useTransform(scrollYProgress, [0, 0.5], [15, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.95, 1]);
  const y = useTransform(scrollYProgress, [0, 0.5], [20, 0]);

  // Premium ease curve
  const easePremium = [0.22, 1, 0.36, 1];

  return (
    <section ref={containerRef} style={{ position: "relative", paddingTop: 180, paddingBottom: 100, perspective: 1200 }}>
      
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", textAlign: "center", position: "relative", zIndex: 2 }}>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: easePremium }}
          style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", borderRadius: 100, background: "rgba(39,174,96,0.08)", border: "1px solid rgba(39,174,96,0.15)", color: "var(--primary-dark)", fontSize: "0.85rem", fontWeight: 600, marginBottom: 32 }}
        >
          <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: "var(--primary)", boxShadow: "0 0 8px var(--primary)" }} />
          EditalRadar 2.0 está no ar
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.15, ease: easePremium }}
          style={{ fontFamily: "var(--font-display)", fontSize: "clamp(3rem, 6vw, 5.5rem)", fontWeight: 800, color: "var(--text)", lineHeight: 1.05, letterSpacing: "-0.04em", marginBottom: 24, maxWidth: 900, margin: "0 auto 24px" }}
        >
          A anatomia exata da <br/>
          <span style={{ color: "var(--primary)", position: "relative", display: "inline-block" }}>
            sua aprovação.
            <div style={{ position: "absolute", bottom: "10%", left: 0, width: "100%", height: "30%", background: "var(--primary)", opacity: 0.15, filter: "blur(8px)", zIndex: -1 }} />
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.25, ease: easePremium }}
          style={{ fontSize: "1.25rem", color: "var(--text-muted)", maxWidth: 650, margin: "0 auto 48px", lineHeight: 1.6 }}
        >
          Esqueça planilhas confusas e estudos às cegas. Tenha métricas avançadas, flashcards inteligentes e controle absoluto do seu edital.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.35, ease: easePremium }}
          style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", marginBottom: 80 }}
        >
          <Link href="/dashboard">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} transition={{ type: "spring", stiffness: 400, damping: 17 }}>
              <Button variant="primary" size="lg" style={{ fontSize: "1.05rem", padding: "0 32px", height: 52, boxShadow: "0 8px 24px rgba(39,174,96,0.3)", borderRadius: 12, display: "flex", alignItems: "center" }}>
                Começar Gratuitamente
                <ArrowRight size={18} style={{ marginLeft: 8 }} />
              </Button>
            </motion.div>
          </Link>
          <Link href="#features">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} transition={{ type: "spring", stiffness: 400, damping: 17 }}>
              <Button variant="secondary" size="lg" style={{ fontSize: "1.05rem", padding: "0 32px", height: 52, background: "white", borderRadius: 12, border: "1px solid rgba(0,0,0,0.08)", boxShadow: "0 4px 12px rgba(0,0,0,0.03)" }}>
                Explorar Produto
              </Button>
            </motion.div>
          </Link>
        </motion.div>

      </div>

      {/* Massive Hero Image with 3D Scroll Effect and Parallax */}
      <motion.div
        style={{
          rotateX,
          scale,
          y,
          transformStyle: "preserve-3d",
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 24px",
          position: "relative",
          zIndex: 10,
        }}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "16/9",
            background: "transparent",
            borderRadius: "var(--radius-2xl)",
            border: "1px solid rgba(0,0,0,0.08)",
            boxShadow: "0 30px 60px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.02), 0 -10px 40px rgba(39,174,96,0.15)",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Fallback color if image fails */}
          <div style={{ position: "absolute", inset: 0, background: "#fdfdfd", zIndex: 0 }} />
          
          <img 
            src="/screenshots/dashboard.png" 
            alt="Dashboard EditalRadar" 
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", position: "relative", zIndex: 1 }}
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://placehold.co/1200x675/e2e8f0/94a3b8?text=Imagem+do+Produto+(/screenshots/dashboard.png)`;
            }}
          />
        </div>
      </motion.div>

    </section>
  );
}
