"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const testimonials = [
  {
    name: "Carlos A.",
    role: "Aspirante à Polícia Federal",
    avatar: "/avatar_carlos.png",
    text: "Finalmente consegui organizar meus estudos para concursos. O EditalRadar virou minha ferramenta principal. Consigo ver exatamente onde estou e o que falta.",
    highlight: "virou minha ferramenta principal",
  },
  {
    name: "Mariana S.",
    role: "Candidata ao Tribunal de Justiça",
    avatar: "/avatar_mariana.png",
    text: "O sistema de metas e acompanhamento mudou completamente minha rotina. Em 3 meses, dobrei minha produtividade nos estudos.",
    highlight: "dobrei minha produtividade",
  },
  {
    name: "Rafael M.",
    role: "Concurseiro — Área Militar",
    avatar: "/avatar_rafael.png",
    text: "Consegui visualizar meu progresso pela primeira vez de forma clara. Os simulados e o heatmap de consistência são incríveis.",
    highlight: "visualizar meu progresso pela primeira vez",
  },
];

function Stars() {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} width="14" height="14" viewBox="0 0 20 20" fill="#fbbf24">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function Bold({ text, highlight }: { text: string; highlight: string }) {
  const parts = text.split(highlight);
  return (
    <>
      {parts[0]}
      <strong style={{ color: "#1e293b", fontWeight: 600 }}>{highlight}</strong>
      {parts[1]}
    </>
  );
}

export default function TestimonialsSection() {
  return (
    <section
      style={{
        background: "#ffffff",
        padding: "clamp(64px, 8vw, 104px) 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient orbs */}
      <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -100, right: -100, width: 480, height: 480, background: "radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)", borderRadius: "50%" }} />
        <div style={{ position: "absolute", bottom: -100, left: -100, width: 480, height: 480, background: "radial-gradient(circle, rgba(59,130,246,0.05) 0%, transparent 70%)", borderRadius: "50%" }} />
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(16px, 4vw, 40px)", position: "relative", zIndex: 1 }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "clamp(40px, 5vw, 64px)" }}>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: EASE }}
            style={{ color: "#10b981", fontWeight: 700, fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 14 }}
          >
            Depoimentos
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: 0.07, ease: EASE }}
            style={{ fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 800, color: "#0f172a", lineHeight: 1.15, marginBottom: 16 }}
          >
            Quem usa,{" "}
            <span style={{ background: "linear-gradient(135deg, #10b981 10%, #3b82f6 90%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              aprova
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.14, ease: EASE }}
            style={{ color: "#64748b", fontSize: "clamp(15px, 2vw, 18px)", maxWidth: 480, margin: "0 auto" }}
          >
            Veja o que nossos usuários dizem sobre a plataforma.
          </motion.p>
        </div>

        {/* Cards — 3 col desktop, 1 col mobile */}
        <div
          className="testimonials-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "clamp(14px, 2vw, 24px)",
            alignItems: "stretch",
          }}
        >
          {testimonials.map((t, i) => (
            <motion.article
              key={i}
              initial={{ opacity: 0, y: 32, filter: "blur(3px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: EASE }}
              whileHover={{ y: -7, boxShadow: "0 24px 56px rgba(0,0,0,0.09)" }}
              style={{
                background: "#ffffff",
                borderRadius: 22,
                padding: "clamp(22px, 2.5vw, 32px)",
                boxShadow: "0 1px 4px rgba(0,0,0,0.04), 0 6px 20px rgba(0,0,0,0.04)",
                display: "flex",
                flexDirection: "column",
                gap: 20,
                transition: "box-shadow 0.3s ease, transform 0.3s ease",
              }}
            >
              {/* Quote glyph */}
              <div
                aria-hidden
                style={{
                  fontSize: 44,
                  lineHeight: 1,
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  color: "#10b981",
                  opacity: 0.5,
                  marginBottom: -10,
                  userSelect: "none",
                }}
              >
                &ldquo;
              </div>

              {/* Stars */}
              <Stars />

              {/* Text */}
              <p style={{ color: "#475569", fontSize: "clamp(14px, 1.5vw, 15.5px)", lineHeight: 1.72, flex: 1, margin: 0 }}>
                <Bold text={t.text} highlight={t.highlight} />
              </p>

              {/* Author */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  paddingTop: 18,
                  borderTop: "1px solid #f1f5f9",
                }}
              >
                <div
                  style={{
                    position: "relative",
                    width: 42,
                    height: 42,
                    borderRadius: "50%",
                    overflow: "hidden",
                    flexShrink: 0,
                    outline: "2px solid #e2e8f0",
                    outlineOffset: 1,
                  }}
                >
                  <Image src={t.avatar} alt={`Foto de ${t.name}`} fill style={{ objectFit: "cover" }} />
                </div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: 13.5, color: "#0f172a", margin: 0 }}>{t.name}</p>
                  <p style={{ fontSize: 12, color: "#94a3b8", margin: 0, marginTop: 2 }}>{t.role}</p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) { .testimonials-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}
