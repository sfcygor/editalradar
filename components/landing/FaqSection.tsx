"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const faqs = [
  {
    q: "O EditalRadar é gratuito?",
    a: "Sim. Existe um plano gratuito com acesso às funcionalidades essenciais. Para quem deseja recursos avançados — simulados ilimitados, flashcards e estatísticas detalhadas — oferecemos planos premium com preços acessíveis.",
  },
  {
    q: "Posso usar para qualquer concurso?",
    a: "Sim. O EditalRadar foi projetado para ser totalmente flexível. Você pode cadastrar suas próprias matérias, montar cronogramas personalizados e adaptar o sistema para qualquer edital — seja militar, policial, fiscal ou federal.",
  },
  {
    q: "Os dados ficam salvos na nuvem?",
    a: "Sim. Tudo fica associado à sua conta. Histórico de estudos, metas, flashcards e simulados estão sempre disponíveis em qualquer dispositivo.",
  },
  {
    q: "Posso cancelar minha assinatura?",
    a: "Sim. O cancelamento é feito a qualquer momento direto no painel da sua conta, sem burocracia. Você mantém o acesso até o final do período já pago.",
  },
  {
    q: "O sistema funciona em celular?",
    a: "Sim. O EditalRadar é totalmente responsivo e funciona em dispositivos móveis, tablets e desktops. Estude de qualquer lugar, a qualquer hora.",
  },
  {
    q: "Como funcionam os simulados?",
    a: "Os simulados permitem resolver questões por matéria ou em formato completo, cronometradas ou não. Ao finalizar você recebe um relatório detalhado e pode acompanhar sua evolução ao longo do tempo.",
  },
];

function Item({ q, a, i }: { q: string; a: string; i: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: i * 0.055, ease: EASE }}
    >
      <div
        style={{
          background: "#ffffff",
          borderRadius: 16,
          overflow: "hidden",
          boxShadow: open
            ? "0 4px 24px rgba(16,185,129,0.07), 0 1px 4px rgba(0,0,0,0.03)"
            : "0 1px 4px rgba(0,0,0,0.04), 0 4px 14px rgba(0,0,0,0.025)",
          transition: "box-shadow 0.25s ease",
        }}
      >
        {/* Trigger */}
        <button
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            padding: "clamp(16px, 2.5vw, 22px) clamp(18px, 3vw, 26px)",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            textAlign: "left",
          }}
        >
          <span
            style={{
              fontSize: "clamp(14px, 1.8vw, 15.5px)",
              fontWeight: 600,
              color: open ? "#059669" : "#1e293b",
              lineHeight: 1.45,
              transition: "color 0.2s ease",
            }}
          >
            {q}
          </span>

          {/* Icon circle */}
          <motion.div
            animate={{ rotate: open ? 45 : 0 }}
            transition={{ duration: 0.22, ease: EASE }}
            style={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              background: open ? "#f0fdf4" : "#f1f5f9",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              transition: "background 0.2s ease",
            }}
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path
                d="M6.5 1v11M1 6.5h11"
                stroke={open ? "#059669" : "#94a3b8"}
                strokeWidth="1.7"
                strokeLinecap="round"
              />
            </svg>
          </motion.div>
        </button>

        {/* Answer */}
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key="answer"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              style={{ overflow: "hidden" }}
            >
              <p
                style={{
                  padding: "0 clamp(18px, 3vw, 26px) clamp(16px, 2.5vw, 22px)",
                  color: "#64748b",
                  fontSize: "clamp(13px, 1.5vw, 15px)",
                  lineHeight: 1.75,
                  margin: 0,
                }}
              >
                {a}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default function FaqSection() {
  return (
    <section
      style={{
        background: "#f8fafc",
        padding: "clamp(64px, 8vw, 104px) 0",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Hairlines */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(to right, transparent, rgba(0,0,0,0.05) 30%, rgba(0,0,0,0.05) 70%, transparent)" }} />

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 clamp(16px, 4vw, 32px)" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "clamp(40px, 5vw, 60px)" }}>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: EASE }}
            style={{ color: "#10b981", fontWeight: 700, fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 14 }}
          >
            Dúvidas frequentes
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: 0.07, ease: EASE }}
            style={{ fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 800, color: "#0f172a", lineHeight: 1.15, marginBottom: 14 }}
          >
            Perguntas frequentes
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.14, ease: EASE }}
            style={{ color: "#64748b", fontSize: "clamp(15px, 2vw, 17px)", maxWidth: 420, margin: "0 auto" }}
          >
            Tudo o que você precisa saber antes de começar.
          </motion.p>
        </div>

        {/* Items */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {faqs.map((f, i) => (
            <Item key={i} q={f.q} a={f.a} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
