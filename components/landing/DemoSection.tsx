"use client";

import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const screenshots = [
  "/screenshots/questoes.png",
  "/screenshots/flashcards.png",
  "/screenshots/metas.png",
  "/screenshots/amigos.png",
];

export default function DemoSection() {
  return (
    <section
      style={{
        padding: "clamp(40px, 6vw, 80px) 0 clamp(60px, 8vw, 110px)",
        overflow: "hidden",
        background: "transparent",
        position: "relative",
      }}
    >
      {/* Section label */}
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: EASE }}
          style={{
            color: "#94a3b8",
            fontWeight: 600,
            fontSize: 13,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          Uma visão completa do seu estudo
        </motion.p>
      </div>

      {/* Marquee */}
      <div
        style={{
          display: "flex",
          maskImage:
            "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
        }}
      >
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            duration: 38,
            ease: "linear",
            repeat: Infinity,
          }}
          style={{
            display: "flex",
            gap: "clamp(16px, 2vw, 28px)",
            paddingLeft: "clamp(16px, 2vw, 28px)",
            flexShrink: 0,
            willChange: "transform",
          }}
        >
          {[...screenshots, ...screenshots].map((src, i) => (
            <div
              key={i}
              style={{
                width: "clamp(480px, 55vw, 800px)",
                aspectRatio: "16/9",
                flexShrink: 0,
                borderRadius: "clamp(10px, 1.5vw, 18px)",
                border: "1px solid rgba(0,0,0,0.055)",
                boxShadow:
                  "0 8px 24px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.04)",
                overflow: "hidden",
                background: "#f8fafc",
                position: "relative",
              }}
            >
              {/* Browser chrome */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 28,
                  background: "rgba(248,250,252,0.95)",
                  backdropFilter: "blur(6px)",
                  zIndex: 2,
                  display: "flex",
                  alignItems: "center",
                  padding: "0 10px",
                  gap: 5,
                  borderBottom: "1px solid rgba(0,0,0,0.04)",
                }}
              >
                {[["#ff5f57", "#fc4238"], ["#febc2e", "#f5a500"], ["#28c840", "#14ae2a"]].map(
                  ([bg], j) => (
                    <div
                      key={j}
                      style={{
                        width: 9,
                        height: 9,
                        borderRadius: "50%",
                        background: bg,
                      }}
                    />
                  )
                )}
              </div>
              <img
                src={src}
                alt={`Tela ${i + 1}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "top",
                  display: "block",
                  paddingTop: 28,
                }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    `https://placehold.co/800x450/f1f5f9/94a3b8?text=Tela+do+Sistema`;
                }}
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
