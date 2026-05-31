"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Timer, User } from "lucide-react";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/questoes": "Questões",
  "/flashcards": "Flashcards",
  "/revisoes": "Revisões",
  "/simulados": "Simulados",
  "/edital": "Edital Tracker",
  "/banco-erros": "Banco de Erros",
  "/cronometro": "Cronômetro",
  "/metas": "Metas",
  "/desempenho": "Desempenho",
  "/heatmap": "Heatmap",
  "/estatisticas": "Estatísticas",
  "/ranking": "Ranking",
  "/amigos": "Amigos",
  "/busca": "Busca Global",
  "/perfil": "Perfil",
};

export default function Header({ initials, avatarUrl }: { initials?: string, avatarUrl?: string | null }) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const rootPath = "/" + (segments[0] || "dashboard");
  const pageTitle = pageTitles[rootPath] || "EditalRadar";

  return (
    <header className="header" id="main-header">
      {/* Page title */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.125rem",
            fontWeight: 700,
            color: "var(--text)",
            lineHeight: 1.2,
          }}
        >
          {pageTitle}
        </h1>
        <span style={{ fontSize: "0.75rem", color: "var(--text-subtle)" }}>
          EditalRadar
        </span>
      </div>

      {/* Search */}
      <div className="header-search" style={{ marginLeft: 24 }}>
        <div className="search-input-wrapper">
          <Search className="search-icon" size={16} />
          <input
            type="search"
            className="search-input"
            placeholder="Buscar questões, flashcards, matérias..."
            id="global-search-input"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="header-right">
        {/* Timer quick access */}
        <Link href="/cronometro" className="header-icon-btn" title="Cronômetro" id="header-timer-btn">
          <Timer size={18} />
        </Link>



        {/* Profile */}
        <Link href="/perfil" className="avatar-btn" title="Meu Perfil" id="header-profile-btn" style={{ padding: avatarUrl ? 0 : undefined, overflow: "hidden" }}>
          {avatarUrl ? (
            <img src={avatarUrl} alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            initials || "US"
          )}
        </Link>
      </div>
    </header>
  );
}
