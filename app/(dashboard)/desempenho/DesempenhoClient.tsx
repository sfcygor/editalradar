"use client";

import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, Cell,
} from "recharts";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { TrendingUp, TrendingDown, Brain, Target, AlertCircle, Star } from "lucide-react";
import { ProgressBar } from "@/components/ui/Badge";
import dynamic from "next/dynamic";

const ClientOnly = ({ children }: { children: React.ReactNode }) => {
  return <div suppressHydrationWarning>{children}</div>;
};

type PerformanceData = { subject: string; accuracy: number; total: number; }[];
type RetentionData = { subject: string; retention: number; }[];
type EvolutionData = { month: string; accuracy: number; }[];

const barColors = ["#27AE60", "#27AE60", "#3B82F6", "#3B82F6", "#F59E0B", "#EF4444"];

export default function DesempenhoClient({
  performance,
  retention,
  evolution,
}: {
  performance: PerformanceData;
  retention: RetentionData;
  evolution: EvolutionData;
}) {
  const radarData = performance.map((p) => ({ subject: p.subject, value: p.accuracy, fullMark: 100 }));
  const avgScore = performance.length > 0 ? Math.round(performance.reduce((a, d) => a + d.accuracy, 0) / performance.length) : 0;
  
  const avgRetention = retention.length > 0 ? Math.round(retention.reduce((a, d) => a + d.retention, 0) / retention.length) : 0;

  const sortedPerformance = [...performance].sort((a, b) => b.accuracy - a.accuracy);
  const best = sortedPerformance.length > 0 ? sortedPerformance[0] : null;
  const worst = sortedPerformance.length > 0 ? sortedPerformance[sortedPerformance.length - 1] : null;

  const subjectDetails = performance.map((p) => {
    const ret = retention.find(r => r.subject === p.subject)?.retention || 0;
    return {
      subject: p.subject,
      score: p.accuracy,
      questions: p.total,
      correct: Math.round((p.accuracy / 100) * p.total),
      trend: p.accuracy > 70 ? "up" : p.accuracy < 50 ? "down" : "stable",
      retention: ret,
    };
  });

  return (
    <div className="page-container animate-fade-in">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-icon green"><Target size={20} strokeWidth={1.8} /></div>
          <div>
            <div className="stat-value">{avgScore}%</div>
            <div className="stat-label">Média Geral</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon blue"><Brain size={20} strokeWidth={1.8} /></div>
          <div>
            <div className="stat-value">{avgRetention}%</div>
            <div className="stat-label">Retenção Média</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon yellow"><Star size={20} strokeWidth={1.8} /></div>
          <div>
            <div className="stat-value">{best?.subject || "—"}</div>
            <div className="stat-label">Melhor Matéria</div>
            {best && <div className="stat-change positive">{best.accuracy}% de acertos</div>}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon red"><AlertCircle size={20} strokeWidth={1.8} /></div>
          <div>
            <div className="stat-value">{worst?.subject || "—"}</div>
            <div className="stat-label">Precisa de Atenção</div>
            {worst && <div className="stat-change negative">{worst.accuracy}% de acertos</div>}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
        <Card>
          <CardHeader>
            <CardTitle>Radar de Desempenho</CardTitle>
            <Badge variant="green">{avgScore}% média</Badge>
          </CardHeader>
          <ClientOnly>
            {radarData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="rgba(226,232,240,0.8)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12, fill: "var(--text-muted)" }} />
                  <Radar
                    name="Desempenho"
                    dataKey="value"
                    stroke="#27AE60"
                    fill="#27AE60"
                    fillOpacity={0.18}
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: "#27AE60" }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: 280, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)" }}>
                Responda questões para ver o radar.
              </div>
            )}
          </ClientOnly>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Evolução Geral</CardTitle>
          </CardHeader>
          <ClientOnly>
            {evolution.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={evolution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(226,232,240,0.6)" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} unit="%" />
                  <Tooltip
                    contentStyle={{ background: "white", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }}
                    formatter={((value: any) => [`${value}%`, "Desempenho"]) as any}
                  />
                  <Line type="monotone" dataKey="accuracy" stroke="#27AE60" strokeWidth={3} dot={{ r: 5, fill: "#27AE60" }} activeDot={{ r: 7 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: 280, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)" }}>
                Responda questões para ver sua evolução.
              </div>
            )}
          </ClientOnly>
        </Card>
      </div>

      <Card style={{ marginBottom: 20 }}>
        <CardHeader>
          <CardTitle>Retenção por Matéria</CardTitle>
          <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Baseado nas suas revisões com Flashcards</span>
        </CardHeader>
        <ClientOnly>
          {retention.length > 0 ? (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={retention} layout="vertical" barSize={20}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(226,232,240,0.6)" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} unit="%" />
                <YAxis type="category" dataKey="subject" tick={{ fontSize: 12, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} width={80} />
                <Tooltip
                  contentStyle={{ background: "white", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }}
                  formatter={((value: any) => [`${value}%`, "Retenção"]) as any}
                />
                <Bar dataKey="retention" radius={[0, 6, 6, 0]}>
                  {retention.map((entry, index) => (
                    <Cell key={index} fill={barColors[index % barColors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: 180, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)" }}>
              Estude flashcards para ver sua retenção.
            </div>
          )}
        </ClientOnly>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Detalhes por Matéria</CardTitle>
        </CardHeader>
        <div className="table-container" style={{ border: "none", borderRadius: 0 }}>
          <table style={{ width: "100%" }}>
            <thead>
              <tr>
                <th>Matéria</th>
                <th>Questões</th>
                <th>Acertos</th>
                <th>Taxa</th>
                <th>Retenção</th>
                <th>Tendência</th>
              </tr>
            </thead>
            <tbody>
              {subjectDetails.map((s) => (
                <tr key={s.subject}>
                  <td style={{ fontWeight: 600 }}>{s.subject}</td>
                  <td>{s.questions}</td>
                  <td>{s.correct}</td>
                  <td>
                    <span style={{ fontWeight: 700, color: s.score >= 80 ? "var(--primary)" : s.score >= 65 ? "var(--accent-dark)" : "var(--danger)" }}>
                      {s.score}%
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 120 }}>
                      <ProgressBar value={s.retention} size="sm" variant={s.retention >= 75 ? "green" : s.retention >= 60 ? "yellow" : "red"} />
                      <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", flexShrink: 0 }}>{s.retention}%</span>
                    </div>
                  </td>
                  <td>
                    {s.trend === "up" && <TrendingUp size={16} color="var(--primary)" />}
                    {s.trend === "down" && <TrendingDown size={16} color="var(--danger)" />}
                    {s.trend === "stable" && <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>—</span>}
                  </td>
                </tr>
              ))}
              {subjectDetails.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: "20px", color: "var(--text-muted)" }}>
                    Nenhum dado disponível.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
