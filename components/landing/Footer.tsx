import Link from "next/link";
import { Target, Mail, MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer style={{ background: "var(--bg-secondary)", borderTop: "1px solid var(--border)", padding: "60px 24px 40px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 40, marginBottom: 60 }}>
        
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <Target color="var(--primary)" size={28} />
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.5rem", color: "var(--text)", letterSpacing: "-0.03em" }}>
              Edital<span style={{ color: "var(--primary)" }}>Radar</span>
            </span>
          </Link>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", lineHeight: 1.6, maxWidth: 300 }}>
            A plataforma definitiva para organizar, medir e acelerar a sua aprovação em concursos militares e policiais.
          </p>
          <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
            <Link href="#" style={{ color: "var(--text-muted)", transition: "color 0.2s" }} className="hover:text-[var(--primary)]"><MessageCircle size={20} /></Link>
            <Link href="#" style={{ color: "var(--text-muted)", transition: "color 0.2s" }} className="hover:text-[var(--primary)]"><Mail size={20} /></Link>
          </div>
        </div>

        <div>
          <h4 style={{ fontWeight: 700, color: "var(--text)", marginBottom: 20 }}>Produto</h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
            <li><Link href="#features" style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: "0.95rem" }} className="hover:text-[var(--primary)]">Funcionalidades</Link></li>
            <li><Link href="#benefits" style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: "0.95rem" }} className="hover:text-[var(--primary)]">Benefícios</Link></li>
            <li><Link href="/dashboard" style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: "0.95rem" }} className="hover:text-[var(--primary)]">Preços</Link></li>
          </ul>
        </div>

        <div>
          <h4 style={{ fontWeight: 700, color: "var(--text)", marginBottom: 20 }}>Legal</h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
            <li><Link href="#" style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: "0.95rem" }} className="hover:text-[var(--primary)]">Termos de Uso</Link></li>
            <li><Link href="#" style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: "0.95rem" }} className="hover:text-[var(--primary)]">Política de Privacidade</Link></li>
            <li><Link href="#" style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: "0.95rem" }} className="hover:text-[var(--primary)]">Contato</Link></li>
          </ul>
        </div>
      </div>
      
      <div style={{ maxWidth: 1200, margin: "0 auto", borderTop: "1px solid var(--border)", paddingTop: 24, textAlign: "center", color: "var(--text-subtle)", fontSize: "0.85rem" }}>
        © {new Date().getFullYear()} EditalRadar. Todos os direitos reservados.
      </div>
    </footer>
  );
}
