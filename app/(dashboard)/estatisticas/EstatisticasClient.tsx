"use client";

import { Clock, FileQuestion, BookOpen, Calendar, Flame, Trophy, TrendingUp, Star, Target } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area,
} from "recharts";

const stats = [
  { label: "Tempo Total Estudado", value: "131h 20min", icon: Clock, color: "blue", change: "+12h esta semana" },
  { label: "Questões Resolvidas", value: "2.180", icon: FileQuestion, color: "green", change: "+89 hoje" },
  { label: "Taxa de Acertos", value: "74%", icon: Target, color: "yellow", change: "+3% este mês" },
  { label: "Flashcards Revisados", value: "1.650", icon: BookOpen, color: "purple", change: "+28 hoje" },
  { label: "Dias Estudando", value: "248", icon: Calendar, color: "blue", change: "desde jan/2026" },
  { label: "Maior Sequência", value: "63 dias", icon: Flame, color: "red", change: "recorde pessoal" },
];

const monthlyData = [
  { month: "Jan", questions: 180, hours: 22, flashcards: 120 },
  { month: "Fev", questions: 240, hours: 28, flashcards: 180 },
  { month: "Mar", questions: 310, hours: 35, flashcards: 220 },
  { month: "Abr", questions: 280, hours: 30, flashcards: 200 },
  { month: "Mai", questions: 420, hours: 42, flashcards: 310 },
  { month: "Jun", questions: 510, hours: 48, flashcards: 380 },
];

const milestones = [
  { label: "Primeira questão respondida", date: "Jan 2026", done: true },
  { label: "100 questões resolvidas", date: "Fev 2026", done: true },
  { label: "Sequência de 7 dias", date: "Mar 2026", done: true },
  { label: "500 questões resolvidas", date: "Abr 2026", done: true },
  { label: "1.000 flashcards revisados", date: "Mai 2026", done: true },
  { label: "Sequência de 30 dias", date: "Jun 2026", done: false },
  { label: "2.500 questões resolvidas", date: "—", done: false },
];

export default function EstatisticasClient() {
  return (
    <div className="page-container animate-fade-in">
      {/* Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16, marginBottom: 24 }}>
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="stat-card">
              <div className={`stat-icon ${s.color}`}><Icon size={20} strokeWidth={1.8} /></div>
              <div>
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
                <div style={{ fontSize: "0.72rem", color: "var(--text-subtle)", marginTop: 4 }}>{s.change}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
        <Card>
          <CardHeader>
            <CardTitle>Questões por Mês</CardTitle>
          </CardHeader>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="colorQ" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#27AE60" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#27AE60" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(226,232,240,0.6)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "white", border: "1px solid var(--border)", borderRadius: 10, fontSize: 12 }} />
              <Area type="monotone" dataKey="questions" stroke="#27AE60" strokeWidth={2.5} fill="url(#colorQ)" dot={{ r: 4, fill: "#27AE60" }} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Horas de Estudo por Mês</CardTitle>
          </CardHeader>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(226,232,240,0.6)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} unit="h" />
              <Tooltip contentStyle={{ background: "white", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} formatter={(value: any) => [`${value} min`, "Tempo"]} />
              <Line type="monotone" dataKey="hours" stroke="#3B82F6" strokeWidth={2.5} dot={{ r: 4, fill: "#3B82F6" }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Milestones */}
      <Card>
        <CardHeader>
          <CardTitle>Conquistas e Marcos</CardTitle>
          <Trophy size={18} color="var(--accent-dark)" />
        </CardHeader>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {milestones.map((m, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: m.done ? "linear-gradient(135deg, var(--primary), var(--primary-light))" : "var(--bg-secondary)",
                  border: m.done ? "none" : "2px solid var(--border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {m.done ? (
                  <Star size={14} color="white" fill="white" />
                ) : (
                  <Star size={14} color="var(--text-subtle)" />
                )}
              </div>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: "0.875rem", color: m.done ? "var(--text)" : "var(--text-muted)", fontWeight: m.done ? 500 : 400 }}>
                  {m.label}
                </span>
              </div>
              <span style={{ fontSize: "0.75rem", color: "var(--text-subtle)", flexShrink: 0 }}>
                {m.done ? m.date : "—"}
              </span>
              {m.done && <Badge variant="green" style={{ fontSize: "0.65rem" }}>✓</Badge>}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
