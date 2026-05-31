"use client";

import { Trophy, Medal, Crown, TrendingUp, Clock, FileQuestion, BookOpen, Flame, Users } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

const categories = [
  { key: "score", label: "Pontuação Geral", icon: Trophy },
];

const rankIcons: Record<number, React.ReactNode> = {
  1: <Crown size={18} color="#F4C542" />,
  2: <Medal size={18} color="#94A3B8" />,
  3: <Medal size={18} color="#CD7F32" />,
};

export default function RankingClient({ ranking, currentUserId }: { ranking: any[], currentUserId: string }) {
  const rankingData = ranking.map((r, i) => ({
    rank: i + 1,
    name: r.name,
    avatar: r.name.slice(0, 2).toUpperCase(),
    avatarUrl: r.avatarUrl,
    score: r.score,
    isMe: r.userId === currentUserId,
  }));

  const myRank = rankingData.find((r) => r.isMe);

  return (
    <div className="page-container animate-fade-in">
      {myRank && (
        <Card style={{ marginBottom: 24, padding: 24, background: "linear-gradient(135deg, rgba(39,174,96,0.08), rgba(46,204,113,0.04))", border: "1px solid rgba(39,174,96,0.2)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 900,
                  fontSize: "3rem",
                  color: "var(--primary)",
                  lineHeight: 1,
                  minWidth: 60,
                  textAlign: "center",
                }}
              >
                #{myRank.rank}
              </div>
              <div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.125rem", color: "var(--text)" }}>
                  Sua posição no ranking
                </div>
                <p style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
                  {myRank.rank === 1 ? "Você está em 1º lugar!" : "Continue estudando para subir no ranking."}
                </p>
              </div>
            </div>
            <div style={{ marginLeft: "auto", display: "flex", gap: 24 }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.25rem", color: "var(--text)" }}>{myRank.score.toLocaleString()}</div>
                <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Pontos</div>
              </div>
            </div>
          </div>
        </Card>
      )}

      <div style={{ overflowX: "auto", marginBottom: 24 }}>
        <div style={{ display: "flex", gap: 8 }}>
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.key}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "8px 16px",
                  borderRadius: "var(--radius-full)",
                  border: "1.5px solid var(--primary)",
                  background: "rgba(39,174,96,0.06)",
                  color: "var(--primary)",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  fontFamily: "var(--font-sans)",
                }}
              >
                <Icon size={14} />
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ranking de Amigos</CardTitle>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.8rem", color: "var(--text-muted)" }}>
            <Users size={14} />
            {rankingData.length} participantes
          </div>
        </CardHeader>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }} className="divide-y">
          {rankingData.map((user) => (
            <div
              key={user.rank}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                padding: "16px 20px",
                background: user.isMe ? "rgba(39,174,96,0.04)" : "transparent",
                transition: "background var(--transition-fast)",
              }}
            >
              <div style={{ width: 36, textAlign: "center", flexShrink: 0 }}>
                {rankIcons[user.rank] || (
                  <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--text-muted)", fontSize: "0.9rem" }}>
                    #{user.rank}
                  </span>
                )}
              </div>

              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  background: user.avatarUrl 
                    ? "transparent" 
                    : user.isMe
                      ? "linear-gradient(135deg, var(--primary), var(--primary-light))"
                      : "linear-gradient(135deg, var(--info), #60A5FA)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: "0.875rem",
                  color: "white",
                  flexShrink: 0,
                  fontFamily: "var(--font-display)",
                  border: user.isMe ? "3px solid rgba(39,174,96,0.3)" : "none",
                  overflow: "hidden",
                }}
              >
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  user.avatar
                )}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontWeight: user.isMe ? 700 : 500, color: "var(--text)", fontSize: "0.9rem" }}>
                    {user.name}
                  </span>
                  {user.isMe && <Badge variant="green">Você</Badge>}
                </div>
              </div>

              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.125rem", color: user.rank === 1 ? "var(--accent-dark)" : "var(--text)" }}>
                  {user.score.toLocaleString()}
                </div>
                <div style={{ fontSize: "0.68rem", color: "var(--text-subtle)" }}>pontos</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
