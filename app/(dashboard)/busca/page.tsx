"use client";

import { useState } from "react";
import { Search, FileQuestion, BookOpen, RefreshCw, Layers, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";

const allResults = [
  { id: 1, type: "questao", title: "Qual é o prazo de prisão temporária para crimes hediondos?", subject: "Direito", topic: "Direito Penal", href: "/questoes" },
  { id: 2, type: "flashcard", title: "O que é habeas corpus?", subject: "Direito", topic: "Direito Constitucional", href: "/flashcards" },
  { id: 3, type: "revisao", title: "Habeas Corpus — Revisão pendente", subject: "Direito", deck: "Direito Constitucional", href: "/revisoes" },
  { id: 4, type: "questao", title: "Determine o valor de x na equação 2x² − 8x + 6 = 0", subject: "Matemática", topic: "Equações do 2° Grau", href: "/questoes" },
  { id: 5, type: "flashcard", title: "Lei de Ohm: V = R × I", subject: "Física", topic: "Eletricidade", href: "/flashcards" },
  { id: 6, type: "materia", title: "Direito Constitucional", subject: "Direito", topic: "Matéria", href: "/edital" },
  { id: 7, type: "questao", title: "A Constituição de 1988 foi promulgada em qual data?", subject: "História", topic: "Brasil Republicano", href: "/questoes" },
  { id: 8, type: "revisao", title: "Concordância Nominal — Revisão pendente", subject: "Português", deck: "Português — Gramática", href: "/revisoes" },
];

const typeIcons: Record<string, React.ReactNode> = {
  questao: <FileQuestion size={16} />,
  flashcard: <BookOpen size={16} />,
  revisao: <RefreshCw size={16} />,
  materia: <Layers size={16} />,
};

const typeLabels: Record<string, string> = {
  questao: "Questão",
  flashcard: "Flashcard",
  revisao: "Revisão",
  materia: "Matéria",
};

const typeVariants: Record<string, "blue" | "yellow" | "green" | "purple"> = {
  questao: "blue",
  flashcard: "yellow",
  revisao: "green",
  materia: "purple",
};

export default function BuscaPage() {
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("todos");

  const filtered = allResults.filter((r) => {
    const matchQuery = r.title.toLowerCase().includes(query.toLowerCase());
    const matchType = typeFilter === "todos" || r.type === typeFilter;
    return matchQuery && matchType;
  });

  const showResults = query.length >= 2;

  return (
    <div className="page-container animate-fade-in">
      {/* Big Search Bar */}
      <div style={{ maxWidth: 680, margin: "0 auto 32px" }}>
        <div className="search-input-wrapper">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            className="search-input"
            style={{ height: 56, fontSize: "1rem", borderRadius: "var(--radius-lg)", paddingLeft: 52 }}
            placeholder="Buscar questões, flashcards, matérias, revisões..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            id="global-search-main"
            autoFocus
          />
        </div>
      </div>

      {/* Type Filters */}
      {showResults && (
        <div style={{ display: "flex", gap: 8, marginBottom: 20, justifyContent: "center", flexWrap: "wrap" }}>
          {[
            { key: "todos", label: "Todos", count: filtered.length },
            ...["questao", "flashcard", "revisao", "materia"].map((t) => ({
              key: t,
              label: typeLabels[t],
              count: allResults.filter((r) => r.type === t && r.title.toLowerCase().includes(query.toLowerCase())).length,
            })),
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setTypeFilter(f.key)}
              style={{
                padding: "7px 16px",
                borderRadius: "var(--radius-full)",
                border: `1.5px solid ${typeFilter === f.key ? "var(--primary)" : "var(--border)"}`,
                background: typeFilter === f.key ? "rgba(39,174,96,0.08)" : "white",
                color: typeFilter === f.key ? "var(--primary-dark)" : "var(--text-muted)",
                fontWeight: typeFilter === f.key ? 600 : 400,
                fontSize: "0.8rem",
                cursor: "pointer",
                transition: "all var(--transition-fast)",
                fontFamily: "var(--font-sans)",
              }}
              id={`busca-filter-${f.key}`}
            >
              {f.label}
              {f.count > 0 && (
                <span style={{ marginLeft: 6, background: "var(--bg-secondary)", borderRadius: "var(--radius-full)", padding: "1px 6px", fontSize: "0.7rem" }}>
                  {f.count}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Results */}
      {showResults ? (
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          {filtered.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {filtered.map((result) => (
                <Link key={result.id} href={result.href}>
                  <div
                    className="card"
                    style={{ padding: "14px 18px", display: "flex", alignItems: "center", gap: 14, cursor: "pointer" }}
                  >
                    <div style={{ color: "var(--text-subtle)", flexShrink: 0 }}>
                      {typeIcons[result.type]}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {result.title}
                      </div>
                      <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                        <Badge variant={typeVariants[result.type]} style={{ fontSize: "0.65rem" }}>{typeLabels[result.type]}</Badge>
                        <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{result.subject}</span>
                        <span style={{ fontSize: "0.72rem", color: "var(--text-subtle)" }}>·</span>
                        <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{result.topic || (result as any).deck}</span>
                      </div>
                    </div>
                    <ChevronRight size={14} color="var(--text-subtle)" />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon"><Search size={32} /></div>
              <div className="empty-state-title">Nenhum resultado</div>
              <p className="empty-state-desc">Tente buscar com outras palavras.</p>
            </div>
          )}
        </div>
      ) : (
        <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center" }}>
          <div className="empty-state">
            <div className="empty-state-icon" style={{ width: 100, height: 100, borderRadius: "var(--radius-2xl)" }}>
              <Search size={40} />
            </div>
            <div className="empty-state-title">Busca Global</div>
            <p className="empty-state-desc">
              Digite pelo menos 2 caracteres para buscar em questões, flashcards, revisões e matérias.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
