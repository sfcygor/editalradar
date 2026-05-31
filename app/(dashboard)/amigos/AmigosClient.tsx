"use client";

import { useState } from "react";
import { Users, Plus, UserMinus, Copy, CheckCheck, Mail } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { addFriendByCodeAction } from "@/lib/actions/friends";

export default function AmigosClient({ friends, myCode }: { friends: any[], myCode: string }) {
  const [copied, setCopied] = useState(false);
  const [addMode, setAddMode] = useState<"code" | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [message, setMessage] = useState<{ text: string, type: "error" | "success" } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(myCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddFriend = async () => {
    if (!inputValue.trim()) return;
    setIsSubmitting(true);
    setMessage(null);
    const res = await addFriendByCodeAction(inputValue.trim());
    if (res.error) {
      setMessage({ text: res.error, type: "error" });
    } else {
      setMessage({ text: "Convite enviado!", type: "success" });
      setInputValue("");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="page-container animate-fade-in">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 20, alignItems: "start" }}>
        
        {/* Main: Friends List */}
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
            <div className="stat-card">
              <div className="stat-icon blue"><Users size={20} strokeWidth={1.8} /></div>
              <div><div className="stat-value">{friends.length}</div><div className="stat-label">Amigos</div></div>
            </div>
            <div className="stat-card">
              <div className="stat-icon green">🟢</div>
              <div><div className="stat-value">{friends.filter((f) => f.isOnline).length}</div><div className="stat-label">Ativos Agora</div></div>
            </div>
            <div className="stat-card">
              <div className="stat-icon yellow">🏆</div>
              <div><div className="stat-value">—</div><div className="stat-label">Sua Posição</div></div>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Seus Amigos</CardTitle>
            </CardHeader>
            <div style={{ display: "flex", flexDirection: "column" }} className="divide-y">
              {friends.map((friend) => (
                <div key={friend.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 20px" }}>
                  <div style={{ position: "relative", flexShrink: 0 }}>
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: "50%",
                        background: friend.avatarUrl ? "transparent" : "linear-gradient(135deg, var(--info), #60A5FA)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        color: "white",
                        fontFamily: "var(--font-display)",
                        overflow: "hidden",
                      }}
                    >
                      {friend.avatarUrl ? (
                        <img src={friend.avatarUrl} alt={friend.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        friend.name.slice(0, 2).toUpperCase()
                      )}
                    </div>
                    <div
                      style={{
                        position: "absolute",
                        bottom: 2,
                        right: 2,
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        background: friend.isOnline ? "#22C55E" : "#94A3B8",
                        border: "2px solid white",
                      }}
                    />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <span style={{ fontWeight: 600, color: "var(--text)", fontSize: "0.875rem" }}>{friend.name}</span>
                      <span style={{ fontSize: "0.7rem", color: friend.isOnline ? "#22C55E" : "#94A3B8", fontWeight: 500 }}>
                        {friend.isOnline ? "Online" : "Offline"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              {friends.length === 0 && (
                <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>
                  Você ainda não tem amigos adicionados.
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Right: Add Friend + My Code */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Card>
            <CardHeader>
              <CardTitle>Meu Código</CardTitle>
            </CardHeader>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: 16, lineHeight: 1.6 }}>
              Compartilhe seu código para que amigos possam te encontrar:
            </p>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 16px",
                background: "var(--bg-secondary)",
                borderRadius: "var(--radius-md)",
                border: "2px dashed var(--border)",
                marginBottom: 12,
              }}
            >
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.5rem", letterSpacing: "0.1em", color: "var(--primary)" }}>
                {myCode}
              </span>
              <button
                onClick={handleCopyCode}
                style={{ background: "none", border: "none", cursor: "pointer", color: copied ? "var(--primary)" : "var(--text-muted)", transition: "color var(--transition-fast)" }}
              >
                {copied ? <CheckCheck size={18} /> : <Copy size={18} />}
              </button>
            </div>
            {copied && <p style={{ fontSize: "0.75rem", color: "var(--primary)", textAlign: "center" }}>Código copiado! ✓</p>}
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Adicionar Amigo</CardTitle>
            </CardHeader>
            <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
              <button
                onClick={() => { setAddMode("code"); setMessage(null); }}
                style={{
                  flex: 1,
                  padding: "8px",
                  borderRadius: "var(--radius-md)",
                  border: `1.5px solid ${addMode === "code" ? "var(--primary)" : "var(--border)"}`,
                  background: addMode === "code" ? "rgba(39,174,96,0.06)" : "white",
                  color: addMode === "code" ? "var(--primary)" : "var(--text-muted)",
                  fontWeight: addMode === "code" ? 600 : 400,
                  cursor: "pointer",
                  fontSize: "0.8rem",
                  fontFamily: "var(--font-sans)",
                }}
              >
                <Copy size={13} style={{ marginRight: 4 }} />
                Por Código
              </button>
            </div>
            {addMode && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <input
                  className="form-input"
                  placeholder="Código do amigo..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  disabled={isSubmitting}
                />
                <Button variant="primary" onClick={handleAddFriend} disabled={isSubmitting || !inputValue}>
                  <Plus size={14} />
                  {isSubmitting ? "Enviando..." : "Enviar Convite"}
                </Button>
                {message && (
                  <p style={{ fontSize: "0.8rem", color: message.type === "error" ? "var(--danger)" : "var(--primary)", marginTop: 4 }}>
                    {message.text}
                  </p>
                )}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
