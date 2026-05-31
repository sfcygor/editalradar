"use client";

import { useState } from "react";
import { XCircle, Search, RefreshCw, BookOpen, ArrowRight, TrendingDown } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import type { Question } from "@/lib/db/schema";
import Link from "next/link";

type ErrorType = Question & {
  lastAnswer: string;
  attemptedAt: Date;
};

const subjectVariants: Record<string, "blue" | "green" | "yellow" | "purple" | "red" | "gray"> = {
  Direito: "blue",
  Matemática: "green",
  Português: "yellow",
  História: "purple",
  Física: "red",
};

export default function BancoErrosClient({ initialErrors }: { initialErrors: ErrorType[] }) {
  const [selectedSubject, setSelectedSubject] = useState("Todos");
  const [search, setSearch] = useState("");

  const subjects = ["Todos", ...Array.from(new Set(initialErrors.map(e => e.subject)))];

  const filtered = initialErrors.filter((e) => {
    const matchSubject = selectedSubject === "Todos" || e.subject === selectedSubject;
    const matchSearch = e.text.toLowerCase().includes(search.toLowerCase());
    return matchSubject && matchSearch;
  });

  const bySubject = subjects.slice(1).map((s) => ({
    name: s,
    count: initialErrors.filter((e) => e.subject === s).length,
  })).filter((s) => s.count > 0);

  return (
    <div className="page-container animate-fade-in">
      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 16, marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-icon red"><XCircle size={20} strokeWidth={1.8} /></div>
          <div>
            <div className="stat-value">{initialErrors.length}</div>
            <div className="stat-label">Total de Erros</div>
          </div>
        </div>
        {bySubject.slice(0, 3).map((s) => (
          <div key={s.name} className="stat-card">
            <div className="stat-icon yellow"><TrendingDown size={20} strokeWidth={1.8} /></div>
            <div>
              <div className="stat-value">{s.count}</div>
              <div className="stat-label">{s.name}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div className="search-input-wrapper">
            <Search className="search-icon" size={16} />
            <input
              type="text"
              className="search-input"
              style={{ borderRadius: "var(--radius-md)" }}
              placeholder="Buscar no banco de erros..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              id="banco-erros-search"
            />
          </div>
        </div>
        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          className="form-input form-select"
          style={{ width: "auto", minWidth: 140 }}
          id="banco-erros-subject-filter"
        >
          {subjects.map((s) => <option key={s}>{s}</option>)}
        </select>
        <Link href="/questoes">
          <Button variant="primary" size="md" id="revisar-erros-btn">
            <RefreshCw size={14} />
            Revisar Erros ({filtered.length})
          </Button>
        </Link>
      </div>

      {/* Errors List */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {filtered.map((error) => (
          <Card key={error.id} style={{ padding: 20 }}>
            <div style={{ display: "flex", gap: 14 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "var(--radius-md)",
                  background: "rgba(239,68,68,0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <XCircle size={18} color="var(--danger)" />
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
                  <Badge variant={subjectVariants[error.subject] || "gray"}>{error.subject}</Badge>
                  {error.topic && <Badge variant="gray">{error.topic}</Badge>}
                </div>

                <p style={{ fontSize: "0.875rem", color: "var(--text)", lineHeight: 1.6, marginBottom: 12 }}>
                  {error.text}
                </p>

                <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
                  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <span
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: 6,
                        background: "rgba(239,68,68,0.1)",
                        border: "1.5px solid rgba(239,68,68,0.3)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        color: "var(--danger)",
                      }}
                    >
                      {error.lastAnswer}
                    </span>
                    <ArrowRight size={12} color="var(--text-subtle)" />
                    <span
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: 6,
                        background: "rgba(39,174,96,0.1)",
                        border: "1.5px solid rgba(39,174,96,0.3)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        color: "var(--primary)",
                      }}
                    >
                      {error.answer}
                    </span>
                    <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>sua resp. → correto</span>
                  </div>
                  <span style={{ fontSize: "0.72rem", color: "var(--text-subtle)" }}>
                    Errou em {error.attemptedAt.toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8, flexShrink: 0 }}>
                <Link href="/flashcards">
                  <Button variant="secondary" size="sm" id={`add-flashcard-${error.id}`}>
                    <BookOpen size={13} />
                    Flashcard
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        ))}
        {filtered.length === 0 && (
          <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>
            Nenhum erro encontrado! Continue assim 🎉
          </div>
        )}
      </div>
    </div>
  );
}
