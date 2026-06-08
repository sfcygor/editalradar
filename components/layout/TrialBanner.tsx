import React from "react";
import { Info, Clock, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function TrialBanner({ daysLeft, planName }: { daysLeft: number, planName: string }) {
  if (daysLeft < 0) return null;

  let indicatorColor = "var(--primary)";
  let Icon = Info;
  
  if (daysLeft <= 7 && daysLeft >= 4) {
    indicatorColor = "var(--warning)";
  } else if (daysLeft <= 3 && daysLeft > 1) {
    indicatorColor = "var(--warning-light)";
    Icon = Clock;
  } else if (daysLeft <= 1) {
    indicatorColor = "var(--danger)";
    Icon = AlertCircle;
  }

  const daysText = daysLeft === 1 ? "1 dia" : `${daysLeft} dias`;

  return (
    <Link href="/perfil" style={{ textDecoration: "none" }}>
      <div style={{
        background: "var(--glass-bg, rgba(255, 255, 255, 0.72))",
        backdropFilter: "var(--glass-blur, blur(16px))",
        WebkitBackdropFilter: "var(--glass-blur, blur(16px))",
        border: "1px solid var(--glass-border, rgba(255, 255, 255, 0.5))",
        boxShadow: "var(--glass-shadow, 0 4px 12px rgba(0, 0, 0, 0.05))",
        borderRadius: "var(--radius-full, 9999px)",
        padding: "4px 12px 4px 4px",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        transition: "all 0.2s ease",
        cursor: "pointer",
      }}>
        {/* Subtle Color Dot / Icon Area */}
        <div style={{
          width: "24px",
          height: "24px",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--surface, #FFFFFF)",
          boxShadow: "0 2px 4px rgba(0,0,0,0.06)",
          color: indicatorColor,
          flexShrink: 0
        }}>
          <Icon size={12} strokeWidth={2.5} />
        </div>

        {/* Text */}
        <div style={{
          fontSize: "0.75rem",
          fontWeight: 600,
          color: "var(--text, #1E293B)",
          display: "flex",
          alignItems: "center",
          whiteSpace: "nowrap"
        }}>
          <span>🎁 Teste Grátis</span>
          <span style={{ 
            color: "var(--text-muted, #64748B)", 
            marginLeft: "6px",
            fontWeight: 500
          }}>
            ({daysText})
          </span>
        </div>
      </div>
    </Link>
  );
}
