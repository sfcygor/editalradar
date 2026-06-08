"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const stats = [
  { emoji: "📚", value: 4500,   suffix: "+", label: "Alunos cadastrados",           accent: "#10b981", bg: "rgba(16,185,129,0.07)"  },
  { emoji: "⏱️", value: 120000, suffix: "+", label: "Horas de estudo registradas",  accent: "#3b82f6", bg: "rgba(59,130,246,0.07)"   },
  { emoji: "✅", value: 2300000,suffix: "+", label: "Questões resolvidas",           accent: "#8b5cf6", bg: "rgba(139,92,246,0.07)"   },
  { emoji: "🎯", value: 97,     suffix: "%", label: "Relatam mais organização",     accent: "#f97316", bg: "rgba(249,115,22,0.07)"   },
  { emoji: "🔥", value: 350000, suffix: "+", label: "Sessões concluídas",            accent: "#ef4444", bg: "rgba(239,68,68,0.07)"    },
  { emoji: "🏆", value: 12000,  suffix: "+", label: "Metas alcançadas",              accent: "#eab308", bg: "rgba(234,179,8,0.07)"    },
];

function fmt(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(".", ",") + "M";
  if (n >= 1_000) return Math.round(n / 1_000) + "K";
  return n.toString();
}

function Counter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref as React.RefObject<Element>, { once: true, margin: "-60px" });

  useEffect(() => {
    if (!inView) return;
    let raf: number;
    const start = performance.now();
    const dur = 1800;
    const tick = (now: number) => {
      const t = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - t, 4); // ease-out quart
      setCount(Math.round(eased * target));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target]);

  return <span ref={ref}>{fmt(count)}{suffix}</span>;
}

export default function StatsSection() {
  return (
    <section
      style={{
        background: "#f8fafc",
        padding: "clamp(64px, 8vw, 104px) 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Hairline borders top / bottom */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(to right, transparent, rgba(0,0,0,0.05) 30%, rgba(0,0,0,0.05) 70%, transparent)" }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 1, background: "linear-gradient(to right, transparent, rgba(0,0,0,0.05) 30%, rgba(0,0,0,0.05) 70%, transparent)" }} />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(16px, 4vw, 40px)" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "clamp(40px, 5vw, 64px)" }}>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: EASE }}
            style={{ color: "#10b981", fontWeight: 700, fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 14 }}
          >
            Números que comprovam
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: 0.07, ease: EASE }}
            style={{ fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 800, color: "#0f172a", lineHeight: 1.15, margin: "0 auto", maxWidth: 600 }}
          >
            A plataforma que está{" "}
            <span style={{ background: "linear-gradient(135deg, #10b981 10%, #3b82f6 90%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              transformando aprovados
            </span>
          </motion.h2>
        </div>

        {/* Cards grid — 3 col desktop, 2 tablet, 1 mobile */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "clamp(12px, 2vw, 20px)",
          }}
          className="stats-grid"
        >
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.06, ease: EASE }}
              whileHover={{ y: -5, boxShadow: "0 20px 48px rgba(0,0,0,0.08)" }}
              style={{
                background: "#ffffff",
                borderRadius: 20,
                padding: "clamp(20px, 2.5vw, 28px)",
                boxShadow: "0 1px 4px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.03)",
                display: "flex",
                alignItems: "center",
                gap: 18,
                cursor: "default",
                transition: "box-shadow 0.3s ease, transform 0.3s ease",
              }}
            >
              {/* Icon */}
              <div
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 14,
                  background: s.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 22,
                  flexShrink: 0,
                }}
              >
                {s.emoji}
              </div>

              {/* Text */}
              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    fontSize: "clamp(22px, 2.5vw, 30px)",
                    fontWeight: 800,
                    color: s.accent,
                    lineHeight: 1,
                    fontVariantNumeric: "tabular-nums",
                    fontFamily: "var(--font-display)",
                  }}
                >
                  <Counter target={s.value} suffix={s.suffix} />
                </div>
                <div style={{ fontSize: 13, color: "#64748b", marginTop: 5, fontWeight: 500, lineHeight: 1.35 }}>
                  {s.label}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Responsive grid override via style tag */}
      <style>{`
        @media (max-width: 900px) { .stats-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 540px) { .stats-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}
