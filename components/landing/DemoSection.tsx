"use client";

import { motion } from "framer-motion";

const screenshots = [
  "/screenshots/questoes.png",
  "/screenshots/flashcards.png",
  "/screenshots/metas.png",
  "/screenshots/amigos.png",
];

export default function DemoSection() {
  return (
    <section style={{ padding: "60px 0 100px", overflow: "hidden", background: "transparent" }}>
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 600, color: "var(--text-muted)" }}>
          Uma visão completa do seu estudo
        </h2>
      </div>

      {/* Marquee Container */}
      <div 
        style={{ 
          display: "flex", 
          gap: 32, 
          paddingLeft: 32, 
          paddingRight: 32,
          maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
          WebkitMaskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)"
        }}
      >
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            duration: 40,
            ease: "linear",
            repeat: Infinity,
          }}
          style={{ 
            display: "flex", 
            gap: 32, 
            flexShrink: 0,
            willChange: "transform" 
          }}
        >
          {/* Double the array for seamless infinite looping */}
          {[...screenshots, ...screenshots].map((src, i) => (
            <div
              key={i}
              style={{
                width: 800, // Large fixed width for each screenshot
                aspectRatio: "16/9",
                flexShrink: 0,
                borderRadius: "var(--radius-xl)",
                border: "1px solid rgba(0,0,0,0.06)",
                boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
                overflow: "hidden",
                background: "#fdfdfd",
              }}
            >
              <img
                src={src}
                alt={`Screenshot ${i}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "top",
                }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://placehold.co/800x450/e2e8f0/94a3b8?text=Tela+do+Sistema`;
                }}
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
