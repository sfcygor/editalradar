"use client";

import {
  FileText, TrendingUp, Search, Bell, Clock, Crosshair, BookOpen, Layers,
  ChevronRight, Circle, Play, PenSquare, Trophy, AlertCircle, Calendar,
  MoreHorizontal
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/Badge";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell,
} from "recharts";
import Link from "next/link";
import dynamic from "next/dynamic";

const ClientOnly = ({ children }: { children: React.ReactNode }) => {
  return <div suppressHydrationWarning>{children}</div>;
};

export default function DashboardClient({ data }: { data: any }) {
  const {
    totalQuestions,
    accuracy,
    totalMinutes,
    flashcardsCount,
    evolution,
    dailyGoals,
    editalProgress,
    editalTotal,
    editalDone,
    simulados,
  } = data;

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const timeString = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

  const completedGoals = dailyGoals.filter((g: any) => g.isCompleted).length;
  const totalGoals = dailyGoals.length;

  return (
    <div className="page-container animate-fade-in" style={{ paddingBottom: 60 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1 className="page-title">Olá, Concurseiro 👋</h1>
          <p className="page-subtitle">Aqui está o resumo do seu desempenho hoje.</p>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <div className="search-input-wrapper" style={{ width: 240, display: "none" }}>
            <Search className="search-icon" size={16} />
            <input type="text" className="search-input" placeholder="Buscar questões, edital..." />
          </div>
          <Button variant="secondary" size="md" icon>
            <Bell size={18} />
          </Button>
          <Link href="/questoes">
            <Button variant="primary" size="md">
              <Play size={16} /> Continuar Estudos
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Stats Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 32 }}>
        <Card className="stat-card">
          <div className="stat-icon green"><Crosshair size={22} strokeWidth={1.8} /></div>
          <div>
            <div className="stat-value">{accuracy}%</div>
            <div className="stat-label">Taxa de Acertos</div>
          </div>
        </Card>
        
        <Card className="stat-card">
          <div className="stat-icon blue"><Clock size={22} strokeWidth={1.8} /></div>
          <div>
            <div className="stat-value">{timeString}</div>
            <div className="stat-label">Tempo Estudado</div>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="stat-icon yellow"><PenSquare size={22} strokeWidth={1.8} /></div>
          <div>
            <div className="stat-value">{totalQuestions}</div>
            <div className="stat-label">Questões Resolvidas</div>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="stat-icon purple"><BookOpen size={22} strokeWidth={1.8} /></div>
          <div>
            <div className="stat-value">{flashcardsCount}</div>
            <div className="stat-label">Flashcards Revisados</div>
          </div>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24, alignItems: "start" }}>
        
        {/* Left Column (Main Content) */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          
          {/* Evolution Chart */}
          <Card>
            <CardHeader style={{ paddingBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <CardTitle>Evolução de Acertos</CardTitle>
                <Link href="/desempenho">
                  <Button variant="ghost" size="sm">Ver tudo <ChevronRight size={14} /></Button>
                </Link>
              </div>
            </CardHeader>
            <ClientOnly>
              <div style={{ padding: "0 24px 24px 24px", height: 280 }}>
                {evolution.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={evolution}>
                      <defs>
                        <linearGradient id="colorAccuracy" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#27AE60" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#27AE60" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(226,232,240,0.6)" />
                      <XAxis dataKey="month" tick={{ fontSize: 12, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} dy={10} />
                      <YAxis tick={{ fontSize: 12, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} dx={-10} domain={[0, 100]} unit="%" />
                      <Tooltip
                        contentStyle={{ background: "white", border: "1px solid var(--border)", borderRadius: 12, boxShadow: "var(--glass-shadow)", fontSize: 12, fontWeight: 600 }}
                        itemStyle={{ color: "var(--primary)" }}
                      />
                      <Area type="monotone" dataKey="accuracy" name="Acertos" stroke="#27AE60" strokeWidth={3} fillOpacity={1} fill="url(#colorAccuracy)" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)" }}>
                    Resolva questões para visualizar sua evolução mensal.
                  </div>
                )}
              </div>
            </ClientOnly>
          </Card>

          {/* Edital Progress */}
          <Card>
            <CardHeader>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Layers size={20} color="var(--primary)" />
                  <CardTitle>Progresso do Edital</CardTitle>
                </div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.25rem", color: "var(--primary)" }}>
                  {editalProgress}%
                </div>
              </div>
            </CardHeader>
            <div style={{ padding: "0 24px 24px 24px" }}>
              <ProgressBar value={editalProgress} size="md" />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12 }}>
                <span style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
                  {editalDone} de {editalTotal} tópicos concluídos
                </span>
                <Link href="/edital">
                  <Button variant="secondary" size="sm">Atualizar Edital</Button>
                </Link>
              </div>
            </div>
          </Card>

          {/* Simulados List */}
          <Card>
            <CardHeader>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <CardTitle>Últimos Simulados</CardTitle>
                <Link href="/simulados">
                  <Button variant="ghost" size="sm">Ver todos <ChevronRight size={14} /></Button>
                </Link>
              </div>
            </CardHeader>
            <div style={{ padding: "0 24px 24px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
              {simulados.slice(0, 3).map((sim: any) => (
                <div key={sim.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: 16, background: "var(--bg-secondary)", borderRadius: "var(--radius-md)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: 40, height: 40, borderRadius: "var(--radius-md)", background: sim.score >= 70 ? "rgba(39,174,96,0.1)" : "rgba(244,197,66,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Trophy size={20} color={sim.score >= 70 ? "var(--primary)" : "var(--accent-dark)"} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: "0.95rem", color: "var(--text)", marginBottom: 4 }}>{sim.name}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{sim.createdAt.toLocaleDateString()} · {sim.totalQuestions} questões</div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    {sim.score !== null ? (
                      <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.125rem", color: sim.score >= 70 ? "var(--primary)" : "var(--accent-dark)" }}>
                        {sim.score}%
                      </div>
                    ) : (
                      <Link href={`/simulados/${sim.id}/execucao`}>
                        <Button variant="primary" size="sm">Continuar</Button>
                      </Link>
                    )}
                  </div>
                </div>
              ))}
              {simulados.length === 0 && (
                <div style={{ textAlign: "center", color: "var(--text-muted)", padding: 20 }}>
                  Nenhum simulado criado.
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Right Column (Sidebar) */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          
          {/* Daily Goals */}
          <Card>
            <CardHeader>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <CardTitle>Metas de Hoje</CardTitle>
                <Badge variant={completedGoals === totalGoals && totalGoals > 0 ? "green" : "gray"}>
                  {completedGoals}/{totalGoals}
                </Badge>
              </div>
            </CardHeader>
            <div style={{ padding: "0 24px 24px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
              {dailyGoals.map((goal: any) => (
                <div key={goal.id}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: "0.875rem" }}>
                    <span style={{ fontWeight: 500, color: "var(--text)" }}>{goal.label}</span>
                    <span style={{ color: goal.isCompleted ? "var(--primary)" : "var(--text-muted)", fontWeight: goal.isCompleted ? 600 : 400 }}>
                      {goal.currentValue} / {goal.targetValue}
                    </span>
                  </div>
                  <ProgressBar value={goal.progressPct} variant={goal.isCompleted ? "green" : "blue"} size="sm" />
                </div>
              ))}
              {dailyGoals.length === 0 && (
                <div style={{ textAlign: "center", color: "var(--text-muted)", padding: 10 }}>
                  Nenhuma meta diária. <Link href="/metas" style={{ color: "var(--primary)" }}>Criar</Link>
                </div>
              )}
            </div>
            {dailyGoals.length > 0 && (
              <CardFooter style={{ padding: "0 24px 24px 24px", borderTop: "none" }}>
                <Link href="/metas" style={{ width: "100%" }}>
                  <Button variant="secondary" style={{ width: "100%" }}>Gerenciar Metas</Button>
                </Link>
              </CardFooter>
            )}
          </Card>

        </div>
      </div>
    </div>
  );
}
