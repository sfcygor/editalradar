"use client";

import React from "react";
import Link from "next/link";
import { Check, Crown } from "lucide-react";
import { PlanType } from "@/lib/permissions";
import { motion } from "framer-motion";

interface BlockedFeatureProps {
  featureName: string;
  requiredPlan: PlanType;
}

export default function BlockedFeature({ featureName, requiredPlan }: BlockedFeatureProps) {
  const planName = requiredPlan.charAt(0).toUpperCase() + requiredPlan.slice(1);
  const isAvancado = requiredPlan === "avancado";
  
  const benefits = isAvancado ? [
    { title: "Simulados Ilimitados" },
    { title: "Revisões Automáticas" },
    { title: "Histórico Completo" },
    { title: "Recursos Avançados" }
  ] : [
    { title: "Flashcards Inteligentes" },
    { title: "Edital Tracker" },
    { title: "Estatísticas Avançadas" },
    { title: "Recursos Premium" }
  ];

  return (
    <div 
      style={{
        width: "100%",
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px"
      }}
    >
      <motion.div 
         initial={{ opacity: 0, scale: 0.95, y: 15 }}
         animate={{ opacity: 1, scale: 1, y: 0 }}
         transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
         style={{
           width: "100%",
           maxWidth: "480px",
           backgroundColor: "rgba(255, 255, 255, 0.65)", // Liquid Glass light base
           backdropFilter: "blur(24px)",
           WebkitBackdropFilter: "blur(24px)",
           border: "1px solid rgba(255, 255, 255, 0.8)",
           borderRadius: "24px",
           padding: "48px 40px",
           display: "flex",
           flexDirection: "column",
           alignItems: "center",
           textAlign: "center",
           boxShadow: "0 20px 40px -12px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255,255,255,0.5) inset",
           position: "relative",
           overflow: "hidden"
         }}
      >
        {/* Top subtle glow */}
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "150px",
          background: "linear-gradient(to bottom, rgba(234, 179, 8, 0.15), transparent)",
          pointerEvents: "none"
        }} />

        <Crown size={48} color="#D97706" style={{ marginBottom: "20px", filter: "drop-shadow(0 4px 6px rgba(234, 179, 8, 0.3))" }} strokeWidth={1.5} />
        
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          padding: "4px 12px",
          borderRadius: "9999px",
          backgroundColor: "rgba(234, 179, 8, 0.15)",
          color: "#B45309",
          fontSize: "12px",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          marginBottom: "24px",
          border: "1px solid rgba(234, 179, 8, 0.3)"
        }}>
          Recurso Exclusivo
        </div>

        <h2 style={{
          fontSize: "24px",
          fontWeight: 800,
          color: "#1E293B", // Dark text for light glass
          marginBottom: "12px",
          lineHeight: 1.2
        }}>
          Recurso exclusivo do plano {planName}
        </h2>
        
        <p style={{
          color: "#64748B", // Muted dark text
          fontSize: "15px",
          marginBottom: "32px",
          lineHeight: 1.6
        }}>
          Faça upgrade para desbloquear este recurso e aproveitar todos os benefícios da plataforma.
        </p>

        <div style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "14px",
          marginBottom: "40px",
          textAlign: "left"
        }}>
           {benefits.map((benefit, i) => (
             <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
               <div style={{
                 width: "20px",
                 height: "20px",
                 borderRadius: "50%",
                 backgroundColor: "rgba(245, 158, 11, 0.2)",
                 display: "flex",
                 alignItems: "center",
                 justifyContent: "center",
                 flexShrink: 0
               }}>
                 <Check size={12} color="#D97706" strokeWidth={4} />
               </div>
               <span style={{ color: "#334155", fontSize: "14px", fontWeight: 600 }}>
                 {benefit.title}
               </span>
             </div>
           ))}
        </div>

        <Link 
          href="/home#pricing" 
          style={{
            width: "100%",
            display: "inline-flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "16px 24px",
            borderRadius: "14px",
            backgroundColor: "#F59E0B",
            color: "#FFFFFF", // White text on solid yellow button
            fontWeight: 700,
            fontSize: "16px",
            textDecoration: "none",
            boxShadow: "0 8px 20px rgba(245, 158, 11, 0.3)",
            transition: "all 0.2s"
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#D97706")}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#F59E0B")}
        >
          Fazer Upgrade
        </Link>
      </motion.div>
    </div>
  );
}
