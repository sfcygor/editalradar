"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useAuthModal } from "@/components/auth/AuthModalProvider";

// ... [plans definition remains the same]
const plans = [
  {
    name: "Gratuito",
    priceMonthly: "0",
    priceAnnual: "0",
    description: "Organização básica para iniciar.",
    features: [
      "Dashboard Básico",
      "Cronômetro de Estudos",
      "Metas Simples",
    ],
    popular: false,
    buttonText: "Começar Grátis",
    buttonVariant: "secondary" as const,
  },
  {
    name: "Padrão",
    priceMonthly: "39",
    priceAnnual: "29",
    description: "Inteligência real para seu estudo diário.",
    features: [
      "Tudo do Gratuito",
      "Flashcards Inteligentes",
      "Edital Tracker",
      "Estatísticas Avançadas",
    ],
    popular: true,
    badgeText: "Mais Popular",
    buttonText: "Começar gratuitamente por 15 dias",
    trialText: "15 dias grátis. Cancele quando quiser.",
    buttonVariant: "primary" as const,
  },
  {
    name: "Avançado",
    priceMonthly: "69",
    priceAnnual: "49",
    description: "Para aprovação rápida e controle total.",
    features: [
      "Tudo do Padrão",
      "Simulados Ilimitados",
      "Revisões Automáticas",
      "Suporte Prioritário",
    ],
    popular: false,
    buttonText: "Assinar Avançado",
    buttonVariant: "secondary" as const,
  },
];

export default function PricingSection({ user }: { user?: any }) {
  const [isAnnual, setIsAnnual] = useState(true);
  const [isLoadingStripe, setIsLoadingStripe] = useState(false);
  const { openRegister } = useAuthModal();

  useEffect(() => {
    if (window.location.hash === "#pricing") {
      setTimeout(() => {
        const el = document.getElementById("pricing");
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 500); // 500ms para garantir que animações terminaram
    }
  }, []);

  const handleSubscribe = async (planName: string) => {
    if (!user) {
      openRegister();
      return;
    }
    
    setIsLoadingStripe(true);
    
    const priceId = planName === "Padrão" 
      ? process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PADRAO 
      : process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_AVANCADO;

    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId })
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else alert(data.error || "Erro ao iniciar checkout");
    } catch (e) {
      alert("Erro ao iniciar checkout");
    } finally {
      setIsLoadingStripe(false);
    }
  };

  return (
    <section id="pricing" style={{ padding: "80px 24px", position: "relative", zIndex: 5, background: "white" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.75rem, 3vw, 2.5rem)", fontWeight: 800, color: "var(--text)", marginBottom: 12, letterSpacing: "-0.03em" }}>
            Planos e Preços
          </h2>
          <p style={{ fontSize: "1rem", color: "var(--text-muted)", maxWidth: 500, margin: "0 auto", lineHeight: 1.5 }}>
            Escolha o plano perfeito para o seu ritmo de estudo. Cancele quando quiser.
          </p>
        </div>

        {/* Toggle */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 12, marginBottom: 48 }}>
          <span style={{ fontSize: "0.9rem", fontWeight: isAnnual ? 500 : 600, color: isAnnual ? "var(--text-muted)" : "var(--text)", transition: "color 0.2s" }}>
            Mensal
          </span>
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            style={{
              width: 52,
              height: 28,
              borderRadius: 32,
              background: isAnnual ? "var(--primary)" : "var(--border)",
              position: "relative",
              cursor: "pointer",
              border: "none",
              transition: "background 0.3s ease",
            }}
          >
            <motion.div
              layout
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              style={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                background: "white",
                position: "absolute",
                top: 4,
                left: isAnnual ? 28 : 4,
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            />
          </button>
          <span style={{ fontSize: "0.9rem", fontWeight: isAnnual ? 600 : 500, color: isAnnual ? "var(--text)" : "var(--text-muted)", display: "flex", alignItems: "center", gap: 8, transition: "color 0.2s" }}>
            Anual
            <span style={{ fontSize: "0.7rem", padding: "2px 6px", background: "rgba(39,174,96,0.1)", color: "var(--primary)", borderRadius: 100, fontWeight: 700 }}>
              -25%
            </span>
          </span>
        </div>

        {/* Cards */}
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", 
          gap: 24, 
          alignItems: "stretch" 
        }}>
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              style={{
                background: "white",
                borderRadius: 16,
                padding: "32px 24px",
                border: plan.popular ? "2px solid var(--primary)" : "1px solid rgba(0,0,0,0.08)",
                boxShadow: plan.popular ? "0 12px 32px rgba(39,174,96,0.1)" : "0 4px 12px rgba(0,0,0,0.02)",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                transform: plan.popular ? "translateY(-8px)" : "none",
                zIndex: plan.popular ? 2 : 1,
              }}
            >
              {plan.popular && (
                <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: "var(--primary)", color: "white", fontSize: "0.75rem", fontWeight: 700, padding: "4px 12px", borderRadius: 100 }}>
                  {plan.badgeText}
                </div>
              )}

              <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>
                {plan.name}
              </h3>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: 20, lineHeight: 1.4, minHeight: 36 }}>
                {plan.description}
              </p>

              <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: (plan as any).trialText ? 8 : 24 }}>
                <span style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text)" }}>R$</span>
                <span style={{ fontFamily: "var(--font-display)", fontSize: "2.5rem", fontWeight: 800, color: "var(--text)", lineHeight: 1 }}>
                  {isAnnual ? plan.priceAnnual : plan.priceMonthly}
                </span>
                <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 500 }}>/mês</span>
              </div>

              {(plan as any).trialText && (
                <p style={{ fontSize: "0.85rem", color: "var(--primary)", fontWeight: 600, marginBottom: 24 }}>
                  {(plan as any).trialText}
                </p>
              )}

              {plan.name === "Padrão" || plan.name === "Avançado" ? (
                <Button 
                  variant={plan.buttonVariant} 
                  onClick={() => handleSubscribe(plan.name)}
                  disabled={isLoadingStripe}
                  style={{ 
                    width: "100%", 
                    height: 40, 
                    fontSize: "0.9rem",
                    border: !plan.popular ? "1px solid var(--border)" : "none",
                    boxShadow: plan.popular ? "0 4px 12px rgba(39,174,96,0.2)" : "none",
                    marginBottom: 24
                  }}
                >
                  {isLoadingStripe ? "Aguarde..." : plan.buttonText}
                </Button>
              ) : (
                <Button 
                  variant={plan.buttonVariant} 
                  onClick={user ? undefined : openRegister}
                  style={{ 
                    width: "100%", 
                    height: 40, 
                    fontSize: "0.9rem",
                    border: !plan.popular ? "1px solid var(--border)" : "none",
                    boxShadow: plan.popular ? "0 4px 12px rgba(39,174,96,0.2)" : "none",
                    marginBottom: 24
                  }}
                >
                  {user ? (
                    <Link href="/dashboard" style={{ color: "inherit", textDecoration: "none", display: "block", width: "100%" }}>
                      Acessar Grátis
                    </Link>
                  ) : (
                    plan.buttonText
                  )}
                </Button>
              )}

              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
                {plan.features.map((feature, idx) => (
                  <li key={idx} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: "0.85rem", color: "var(--text)" }}>
                    <div style={{ color: "var(--primary)", flexShrink: 0 }}>
                      <Check size={16} strokeWidth={2.5} />
                    </div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
