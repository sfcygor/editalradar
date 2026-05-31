"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Plus, ChevronRight, Clock, BarChart3, BookOpen, Timer } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatDuration } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { saveStudySessionAction } from "@/lib/actions/sessions";
import { StudySession } from "@/lib/db/schema";
import { ClientOnly } from "@/components/ui/ClientOnly";
import ManageSubjectsModal from "@/components/subjects/ManageSubjectsModal";



export default function CronometroClient({
  initialSessions,
  initialWeekly,
  initialTodaySeconds,
  globalSubjects = [],
}: {
  initialSessions: StudySession[];
  initialWeekly: { day: string; minutes: number; date: string }[];
  initialTodaySeconds: number;
  globalSubjects?: { id: string; name: string; color: string }[];
}) {
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState(globalSubjects[0]?.name || "Direito");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [isManageSubjectsOpen, setIsManageSubjectsOpen] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (running) {
      if (!sessionStartTime) setSessionStartTime(new Date().toISOString());
      intervalRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, sessionStartTime]);

  const handleReset = () => {
    setRunning(false);
    setElapsed(0);
    setSessionStartTime(null);
  };

  const handleSave = async () => {
    if (elapsed < 10) return; // ignore short sessions
    setRunning(false);
    await saveStudySessionAction(selectedSubject, selectedTopic, elapsed, sessionStartTime!);
    setElapsed(0);
    setSessionStartTime(null);
  };

  const totalWeek = initialWeekly.reduce((a, d) => a + d.minutes, 0);

  return (
    <div className="page-container animate-fade-in">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 20, alignItems: "start" }}>
        {/* Left: Timer */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Main Timer Card */}
          <Card style={{ textAlign: "center", padding: "40px 32px" }}>
            {/* Subject select */}
            <div style={{ marginBottom: 32 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <label style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600 }}>
                  MATÉRIA
                </label>
                <button 
                  onClick={() => setIsManageSubjectsOpen(true)}
                  style={{ background: "transparent", border: "none", color: "var(--primary)", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}
                >
                  Gerenciar Matérias
                </button>
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
                {globalSubjects.map((s) => {
                  const subColor = `var(--${s.color}, var(--primary))`;
                  const isSelected = selectedSubject === s.name;
                  return (
                    <button
                      key={s.id}
                      onClick={() => setSelectedSubject(s.name)}
                      style={{
                        padding: "6px 14px",
                        borderRadius: "var(--radius-full)",
                        border: "1.5px solid",
                        borderColor: isSelected ? subColor : "var(--border)",
                        background: isSelected ? `${subColor}12` : "white",
                        color: isSelected ? subColor : "var(--text-muted)",
                        fontWeight: isSelected ? 700 : 400,
                        fontSize: "0.78rem",
                        cursor: "pointer",
                        transition: "all var(--transition-fast)",
                        fontFamily: "var(--font-sans)",
                      }}
                      id={`select-subject-${s.name}`}
                    >
                      {s.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Timer Display */}
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "5rem",
                fontWeight: 700,
                color: running ? "var(--primary)" : "var(--text)",
                letterSpacing: "-0.02em",
                lineHeight: 1,
                marginBottom: 8,
                transition: "color var(--transition-base)",
              }}
            >
              {formatDuration(elapsed)}
            </div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: 40 }}>
              {running ? `Estudando ${selectedSubject}` : "Pronto para iniciar"}
            </div>

            {/* Controls */}
            <div style={{ display: "flex", gap: 16, justifyContent: "center", alignItems: "center" }}>
              <button
                onClick={handleReset}
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  border: "1.5px solid var(--border)",
                  background: "white",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--text-muted)",
                  transition: "all var(--transition-fast)",
                }}
                id="timer-reset-btn"
              >
                <RotateCcw size={18} />
              </button>

              <button
                onClick={() => setRunning(!running)}
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  border: "none",
                  background: running
                    ? "linear-gradient(135deg, #EF4444, #F87171)"
                    : "linear-gradient(135deg, var(--primary), var(--primary-light))",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  boxShadow: running
                    ? "0 8px 24px rgba(239,68,68,0.35)"
                    : "0 8px 24px rgba(39,174,96,0.35)",
                  transition: "all var(--transition-base)",
                  animation: running ? "pulse-green 2s infinite" : "none",
                }}
                id="timer-toggle-btn"
              >
                {running ? <Pause size={28} /> : <Play size={28} style={{ marginLeft: 3 }} />}
              </button>

              <button
                onClick={handleSave}
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  border: "1.5px solid var(--border)",
                  background: "white",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--text-muted)",
                }}
                id="timer-save-btn"
              >
                <Plus size={18} />
              </button>
            </div>
          </Card>

          {/* Weekly Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Estudo Semanal</CardTitle>
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                {Math.round(totalWeek / 60)}h esta semana
              </span>
            </CardHeader>
            <ClientOnly>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={initialWeekly} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(226,232,240,0.8)" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} unit="min" />
                <Tooltip
                  contentStyle={{ background: "white", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }}
                  formatter={(value: any) => [`${value} min`, "Estudo"]}
                />
                <Bar dataKey="minutes" fill="#27AE60" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            </ClientOnly>
          </Card>
        </div>

        {/* Right: Stats + Sessions */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Time Stats */}
          {[
            { label: "Hoje", value: formatDuration(initialTodaySeconds), icon: Clock },
            { label: "Esta Semana", value: `${Math.round(totalWeek / 60)}h`, icon: BarChart3 },
            { label: "Total", value: "248h 30min", icon: Timer },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="stat-card" style={{ padding: "16px 20px" }}>
                <div className="stat-icon blue">
                  <Icon size={18} strokeWidth={1.8} />
                </div>
                <div>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.25rem", color: "var(--text)" }}>
                    {s.value}
                  </div>
                  <div className="stat-label">{s.label}</div>
                </div>
              </div>
            );
          })}

          {/* Recent Sessions */}
          <Card>
            <CardHeader>
              <CardTitle>Sessões Recentes</CardTitle>
            </CardHeader>
            <div style={{ display: "flex", flexDirection: "column" }} className="divide-y">
              {initialSessions.map((session) => (
                <div key={session.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0" }}>
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: `var(--${globalSubjects.find((s) => s.name === session.subject)?.color || "primary"}, var(--text-subtle))`,
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "0.8rem", fontWeight: 500, color: "var(--text)" }}>{session.topic || "Sessão"}</div>
                    <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{session.subject} · {new Date(session.endedAt).toLocaleDateString()}</div>
                  </div>
                  <span style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.85rem", color: "var(--text-muted)", flexShrink: 0 }}>
                    {formatDuration(session.durationSeconds)}
                  </span>
                </div>
              ))}
              {initialSessions.length === 0 && (
                <div style={{ padding: "20px 0", color: "var(--text-muted)", fontSize: "0.8rem", textAlign: "center" }}>
                  Nenhuma sessão registrada.
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
      <ManageSubjectsModal 
        isOpen={isManageSubjectsOpen} 
        onClose={() => setIsManageSubjectsOpen(false)} 
        globalSubjects={globalSubjects as any} 
      />
    </div>
  );
}
