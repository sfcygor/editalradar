import { getSession } from "@/lib/session";
import SuporteClient from "./SuporteClient";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";

export const metadata = {
  title: "Central de Suporte - EditalRadar",
  description: "Entre em contato conosco para relatar bugs, dúvidas ou enviar sugestões.",
};

export default async function SuportePage() {
  const session = await getSession();
  const userEmail = session?.email || "";

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--background)" }}>
      {/* Header Simples */}
      <header style={{ 
        height: 70, 
        borderBottom: "1px solid var(--border)", 
        display: "flex", 
        alignItems: "center", 
        padding: "0 24px",
        background: "white",
        justifyContent: "space-between"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Link href={session ? "/dashboard" : "/home"} style={{ color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 8, fontSize: "0.875rem", fontWeight: 600, textDecoration: "none" }}>
            <ArrowLeft size={16} />
            Voltar
          </Link>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Image src="/logo.png" alt="EditalRadar" width={24} height={24} />
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.1rem" }}>Edital<span style={{ color: "var(--primary)" }}>Radar</span></span>
        </div>
      </header>

      {/* Conteúdo */}
      <main style={{ flex: 1, padding: "40px 24px", display: "flex", justifyContent: "center" }}>
        <div style={{ width: "100%", maxWidth: 600 }}>
          <div style={{ marginBottom: 32, textAlign: "center" }}>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 800, color: "var(--text)", marginBottom: 8 }}>Central de Suporte</h1>
            <p style={{ color: "var(--text-muted)", lineHeight: 1.6 }}>Encontrou um problema, tem uma dúvida ou quer dar um feedback? Envie uma mensagem e nossa equipe ajudará o mais rápido possível.</p>
          </div>
          
          <SuporteClient initialEmail={userEmail} isLoggedIn={!!session} />
        </div>
      </main>
    </div>
  );
}
