"use client";

import { PenSquare, Plus, FileQuestion, Trophy, Play } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge, ProgressBar } from "@/components/ui/Badge";
import type { Simulado } from "@/lib/db/schema";
import Link from "next/link";

export default function SimuladosClient({ initialSimulados }: { initialSimulados: Simulado[] }) {
  const concluido = initialSimulados.filter(s => s.score !== null);
  const pendente = initialSimulados.filter(s => s.score === null);
  const media = concluido.length > 0 ? Math.round(concluido.reduce((a, s) => a + (s.score || 0), 0) / concluido.length) : 0;
  const questoesRespondidas = concluido.reduce((a, s) => a + (s.totalQuestions || 0), 0);

  return (
    <div className="page-container animate-fade-in">
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 24 }}>
        <Link href="/simulados/novo">
          <Button variant="primary" id="new-simulado-btn">
            <Plus size={14} />
            Novo Simulado
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-icon blue"><PenSquare size={20} strokeWidth={1.8} /></div>
          <div><div className="stat-value">{concluido.length}</div><div className="stat-label">Simulados Concluídos</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green"><Trophy size={20} strokeWidth={1.8} /></div>
          <div><div className="stat-value">{media}%</div><div className="stat-label">Média de Acertos</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon yellow"><FileQuestion size={20} strokeWidth={1.8} /></div>
          <div><div className="stat-value">{questoesRespondidas}</div><div className="stat-label">Questões Respondidas</div></div>
        </div>
      </div>

      {/* Simulados List */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {initialSimulados.map((s) => (
          <Card key={s.id} style={{ padding: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.9rem", color: "var(--text)" }}>{s.name}</h3>
                  <Badge variant={s.score !== null ? "green" : "yellow"}>{s.score !== null ? "concluído" : "pendente"}</Badge>
                </div>
                <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>📅 {s.createdAt.toLocaleDateString()}</span>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>❓ {s.totalQuestions} questões</span>
                  {s.durationMinutes && <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>⏱ {s.durationMinutes}min</span>}
                  {s.subjects && s.subjects.length > 0 && (
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>📚 {s.subjects.join(", ")}</span>
                  )}
                </div>
                {s.score !== null && (
                  <div style={{ marginTop: 10 }}>
                    <ProgressBar value={s.score} variant={s.score >= 75 ? "green" : s.score >= 60 ? "yellow" : "red"} size="sm" />
                  </div>
                )}
              </div>
              {s.score !== null && (
                <div style={{ textAlign: "center", minWidth: 80 }}>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.75rem", color: s.score >= 75 ? "var(--primary)" : s.score >= 60 ? "var(--accent-dark)" : "var(--danger)" }}>
                    {s.score}%
                  </div>
                  <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>acertos</div>
                </div>
              )}
              <div style={{ display: "flex", gap: 8 }}>
                {s.score === null ? (
                  <Link href={`/simulados/${s.id}/execucao`}>
                    <Button variant="primary" size="sm" id={`start-simulado-${s.id}`}><Play size={13} />Iniciar</Button>
                  </Link>
                ) : (
                  <Button variant="secondary" size="sm" id={`view-simulado-${s.id}`}>Ver Relatório</Button>
                )}
              </div>
            </div>
          </Card>
        ))}
        {initialSimulados.length === 0 && (
          <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>
            Você ainda não criou nenhum simulado.
          </div>
        )}
      </div>
    </div>
  );
}
