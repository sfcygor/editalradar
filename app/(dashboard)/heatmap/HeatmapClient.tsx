"use client";

import { useEffect, useRef } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";

const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
const weekdays = ["Dom", "", "Ter", "", "Qui", "", "Sáb"];

export default function HeatmapClient({ heatmapData }: { heatmapData: { date: string; level: number; minutes: number }[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, [heatmapData]);

  const studied = heatmapData.filter((d) => d.level > 0);
  const totalMinutes = studied.reduce((a, d) => a + d.minutes, 0);

  // Build weeks
  const weeks: typeof heatmapData[] = [];
  let currentWeek: typeof heatmapData = [];
  heatmapData.forEach((d, i) => {
    currentWeek.push(d);
    if (currentWeek.length === 7 || i === heatmapData.length - 1) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  // Current streak
  let streak = 0;
  for (let i = heatmapData.length - 1; i >= 0; i--) {
    if (heatmapData[i].level > 0) streak++;
    else break;
  }

  // Longest streak
  let longest = 0, current = 0;
  heatmapData.forEach((d) => {
    if (d.level > 0) { current++; longest = Math.max(longest, current); }
    else current = 0;
  });

  return (
    <div className="page-container animate-fade-in">
      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
      {[
        { label: "Sequência Atual", value: `${streak} dias`, icon: "🔥", color: "red" as const },
        { label: "Maior Sequência", value: `${longest} dias`, icon: "🏆", color: "yellow" as const },
        { label: "Dias Estudados", value: studied.length, icon: "📅", color: "blue" as const },
        { label: "Minutos Totais", value: `${Math.round(totalMinutes / 60)}h`, icon: "⏱", color: "green" as const },
      ].map((s) => (
        <div key={s.label} className="stat-card">
          <div className={`stat-icon ${s.color}`} style={{ fontSize: "1.4rem", width: 48, height: 48 }}>
            {s.icon}
          </div>
          <div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        </div>
      ))}
      </div>

      {/* Main Heatmap */}
      <Card style={{ marginBottom: 24 }}>
        <CardHeader>
          <CardTitle>Calendário de Consistência — {new Date().getFullYear()}</CardTitle>
          <div style={{ display: "flex", gap: 12 }}>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
              {studied.length} dias estudados
            </span>
          </div>
        </CardHeader>

        <div ref={scrollRef} style={{ overflowX: "auto", paddingBottom: 16, scrollBehavior: "smooth" }} className="custom-scrollbar">
          <div style={{ display: "flex", gap: 4, minWidth: "fit-content", paddingRight: 16 }}>
            {/* Weekday labels */}
            <div style={{ display: "flex", flexDirection: "column", gap: 3, paddingTop: 22, marginRight: 4 }}>
              {weekdays.map((d, i) => (
                <div key={i} style={{ height: 14, fontSize: "0.65rem", color: "var(--text-subtle)", lineHeight: "14px", textAlign: "right", paddingRight: 4 }}>
                  {d}
                </div>
              ))}
            </div>

            <div>
              {/* Month labels */}
              <div style={{ display: "flex", marginBottom: 4, gap: 3 }}>
                {weeks.map((week, wi) => {
                  const firstDay = new Date(week[0]?.date || "");
                  const isFirstOfMonth = firstDay.getDate() <= 7;
                  return (
                    <div key={wi} style={{ width: 14, fontSize: "0.62rem", color: "var(--text-subtle)", whiteSpace: "nowrap" }}>
                      {isFirstOfMonth ? months[firstDay.getMonth()] : ""}
                    </div>
                  );
                })}
              </div>

              {/* Grid */}
              <div style={{ display: "flex", gap: 3 }}>
                {weeks.map((week, wi) => (
                  <div key={wi} style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    {week.map((day, di) => (
                      <div
                        key={di}
                        className="heatmap-cell"
                        data-level={day.level}
                        style={{ width: 14, height: 14 }}
                        title={`${new Date(day.date).toLocaleDateString()}: ${day.minutes > 0 ? `${day.minutes} minutos` : "Sem estudo"}`}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Legend */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 14, justifyContent: "flex-end", paddingRight: 16 }}>
            <span style={{ fontSize: "0.7rem", color: "var(--text-subtle)" }}>Menos</span>
            {[0, 1, 2, 3, 4].map((level) => (
              <div key={level} className="heatmap-cell" data-level={level} style={{ cursor: "default", width: 14, height: 14 }} />
            ))}
            <span style={{ fontSize: "0.7rem", color: "var(--text-subtle)" }}>Mais</span>
          </div>
        </div>
      </Card>

      {/* Monthly Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo Mensal</CardTitle>
        </CardHeader>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 12 }}>
          {months.map((month) => {
            const monthData = heatmapData.filter((d) => {
              const dm = new Date(d.date).getMonth();
              return months[dm] === month;
            });
            const studiedDays = monthData.filter((d) => d.level > 0).length;
            const totalDays = monthData.length;
            const pct = totalDays ? Math.round((studiedDays / totalDays) * 100) : 0;

            if (totalDays === 0) return null; // Don't show future empty months if not needed, or show 0

            return (
              <div
                key={month}
                style={{
                  textAlign: "center",
                  padding: "12px 8px",
                  borderRadius: "var(--radius-md)",
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border)",
                }}
              >
                <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: 8 }}>{month}</div>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: "1.25rem",
                    color: pct >= 75 ? "var(--primary)" : pct >= 50 ? "var(--accent-dark)" : "var(--text-muted)",
                  }}
                >
                  {pct}%
                </div>
                <div style={{ fontSize: "0.65rem", color: "var(--text-subtle)", marginTop: 4 }}>
                  {studiedDays}/{totalDays} dias
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
