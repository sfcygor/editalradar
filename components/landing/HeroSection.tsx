"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useRef } from "react";

// Premium spring config used by Framer / Linear
const SPRING = { type: "spring", stiffness: 300, damping: 30 } as const;
const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

// Stagger container
const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 28, filter: "blur(4px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: EASE },
  },
};

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Parallax for the image — stays slightly behind
  const rawY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const imgY = useSpring(rawY, { stiffness: 80, damping: 20 });

  // 3D tilt that flattens as you scroll — premium "unfolding" effect
  const rotateX = useTransform(scrollYProgress, [0, 0.4], [12, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.4], [0.96, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.15], [1, 1]);

  return (
    <section
      ref={containerRef}
      style={{
        position: "relative",
        paddingTop: "clamp(130px, 14vw, 200px)",
        paddingBottom: "clamp(60px, 8vw, 120px)",
        perspective: 1400,
        overflow: "hidden",
      }}
    >
      {/* Ambient light blobs */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          overflow: "hidden",
        }}
      >
        <motion.div
          animate={{ scale: [1, 1.05, 1], opacity: [0.6, 0.8, 0.6] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            top: -160,
            left: "15%",
            width: 700,
            height: 700,
            background:
              "radial-gradient(circle, rgba(16,185,129,0.13) 0%, transparent 70%)",
            borderRadius: "50%",
            filter: "blur(1px)",
          }}
        />
        <motion.div
          animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.6, 0.4] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          style={{
            position: "absolute",
            top: 0,
            right: "5%",
            width: 600,
            height: 600,
            background:
              "radial-gradient(circle, rgba(59,130,246,0.09) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />
      </div>

      {/* Text content — staggered entrance */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 clamp(16px, 4vw, 40px)",
          textAlign: "center",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* Badge */}
        <motion.div variants={item} style={{ display: "inline-flex" }}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={SPRING}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 14px 6px 8px",
              borderRadius: 100,
              background: "rgba(16,185,129,0.07)",
              border: "1px solid rgba(16,185,129,0.18)",
              color: "#059669",
              fontSize: 13,
              fontWeight: 600,
              marginBottom: 32,
              cursor: "default",
            }}
          >
            <motion.span
              animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{
                display: "inline-block",
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "#10b981",
                boxShadow: "0 0 10px rgba(16,185,129,0.6)",
              }}
            />
            EditalRadar 2.0 está no ar
          </motion.div>
        </motion.div>

        {/* H1 */}
        <motion.h1
          variants={item}
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2.6rem, 6.5vw, 5.5rem)",
            fontWeight: 800,
            color: "#0f172a",
            lineHeight: 1.04,
            letterSpacing: "-0.04em",
            marginBottom: 24,
            maxWidth: 900,
            margin: "0 auto 24px",
          }}
        >
          A anatomia exata da{" "}
          <br />
          <span
            style={{
              position: "relative",
              display: "inline-block",
              color: "#10b981",
            }}
          >
            sua aprovação.
            {/* Glow underline */}
            <span
              aria-hidden
              style={{
                position: "absolute",
                bottom: "4px",
                left: 0,
                width: "100%",
                height: "28%",
                background: "rgba(16,185,129,0.12)",
                filter: "blur(10px)",
                zIndex: -1,
                borderRadius: 4,
              }}
            />
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={item}
          style={{
            fontSize: "clamp(1rem, 2.2vw, 1.25rem)",
            color: "#64748b",
            maxWidth: 600,
            margin: "0 auto 48px",
            lineHeight: 1.65,
          }}
        >
          Esqueça planilhas confusas e estudos às cegas. Tenha métricas avançadas,
          flashcards inteligentes e controle absoluto do seu edital.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={item}
          style={{
            display: "flex",
            gap: 12,
            justifyContent: "center",
            flexWrap: "wrap",
            marginBottom: 72,
          }}
        >
          <Link href="/dashboard">
            <motion.div
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={SPRING}
            >
              <Button
                variant="primary"
                size="lg"
                style={{
                  fontSize: "1rem",
                  padding: "0 28px",
                  height: 50,
                  boxShadow:
                    "0 8px 24px rgba(16,185,129,0.28), 0 2px 8px rgba(16,185,129,0.15)",
                  borderRadius: 12,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                Começar Gratuitamente
                <ArrowRight size={17} />
              </Button>
            </motion.div>
          </Link>

          <Link href="/home#features">
            <motion.div
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={SPRING}
            >
              <Button
                variant="secondary"
                size="lg"
                style={{
                  fontSize: "1rem",
                  padding: "0 28px",
                  height: 50,
                  background: "rgba(255,255,255,0.9)",
                  borderRadius: 12,
                  border: "1px solid rgba(0,0,0,0.07)",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  backdropFilter: "blur(8px)",
                }}
              >
                Explorar Produto
              </Button>
            </motion.div>
          </Link>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          variants={item}
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          style={{
            display: "inline-flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
            color: "#94a3b8",
            fontSize: 11,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            fontWeight: 600,
            marginBottom: 48,
          }}
        >
          Role para ver mais
          <ChevronDown size={16} />
        </motion.div>
      </motion.div>

      {/* Hero image with 3-D unfolding + parallax */}
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 clamp(16px, 3vw, 32px)",
          position: "relative",
          zIndex: 10,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 60, rotateX: 20, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.5, ease: EASE }}
          style={{ rotateX, scale, y: imgY, transformStyle: "preserve-3d" }}
        >
          {/* Image frame */}
          <div
            style={{
              position: "relative",
              width: "100%",
              aspectRatio: "16/9",
              borderRadius: "clamp(12px, 2vw, 24px)",
              border: "1px solid rgba(0,0,0,0.06)",
              boxShadow:
                "0 0 0 1px rgba(0,0,0,0.015), 0 8px 24px rgba(0,0,0,0.06), 0 32px 80px rgba(0,0,0,0.10), 0 -6px 40px rgba(16,185,129,0.08)",
              overflow: "hidden",
              background: "#f8fafc",
            }}
          >
            {/* Browser chrome bar */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 36,
                background: "rgba(248,250,252,0.95)",
                backdropFilter: "blur(8px)",
                zIndex: 2,
                display: "flex",
                alignItems: "center",
                padding: "0 14px",
                gap: 6,
                borderBottom: "1px solid rgba(0,0,0,0.05)",
              }}
            >
              {[["#ff5f57", "#fc4238"], ["#febc2e", "#f5a500"], ["#28c840", "#14ae2a"]].map(
                ([bg, shadow], i) => (
                  <div
                    key={i}
                    style={{
                      width: 11,
                      height: 11,
                      borderRadius: "50%",
                      background: bg,
                      boxShadow: `0 0 0 0.5px ${shadow}40`,
                    }}
                  />
                )
              )}
            </div>

            <img
              src="/screenshots/dashboard.png"
              alt="Dashboard EditalRadar"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "top",
                display: "block",
                paddingTop: 36,
              }}
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://placehold.co/1280x720/f1f5f9/94a3b8?text=Dashboard+EditalRadar`;
              }}
            />

            {/* Gradient vignette at bottom */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "20%",
                background:
                  "linear-gradient(to top, rgba(248,250,252,0.6), transparent)",
                pointerEvents: "none",
                zIndex: 3,
              }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
