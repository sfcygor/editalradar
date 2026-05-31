"use client";

import { useState } from "react";
import {
  ClipboardList,
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronUp,
  Plus,
  AlertCircle,
  Save,
  Trash2,
} from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import type { EditalItem } from "@/lib/db/schema";
import { createEditalItemAction, toggleEditalItemAction, deleteEditalItemAction } from "@/lib/actions/edital";

const priorityColors: Record<string, "red" | "yellow" | "gray"> = {
  alta: "red",
  média: "yellow",
  baixa: "gray",
};

function SubjectRow({
  subjectName,
  items,
  weight,
  onToggle,
  onDelete,
}: {
  subjectName: string;
  items: EditalItem[];
  weight: number;
  onToggle: (id: string, done: boolean) => void;
  onDelete: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const doneCount = items.filter((i) => i.done).length;
  const progress = items.length > 0 ? Math.round((doneCount / items.length) * 100) : 0;

  return (
    <div
      style={{
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-md)",
        overflow: "hidden",
      }}
    >
      <div
        onClick={() => setExpanded(!expanded)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "14px 16px",
          background: "var(--bg-secondary)",
          cursor: "pointer",
          userSelect: "none",
        }}
      >
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <span style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--text)" }}>
              {subjectName}
            </span>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginLeft: "auto" }}>
              {doneCount}/{items.length} concluídos
            </span>
          </div>
          <ProgressBar value={progress} size="sm" variant={progress >= 80 ? "green" : progress >= 50 ? "yellow" : "red"} />
        </div>
        <div style={{ color: "var(--text-muted)", flexShrink: 0 }}>
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </div>

      {expanded && (
        <div style={{ background: "white" }}>
          {items.map((item) => (
            <div
              key={item.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 16px",
                borderTop: "1px solid var(--border-light)",
                transition: "background var(--transition-fast)",
              }}
            >
              <button
                onClick={() => onToggle(item.id, !item.done)}
                style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center" }}
              >
                {item.done ? (
                  <CheckCircle2 size={18} color="var(--primary)" />
                ) : (
                  <Circle size={18} color="var(--text-subtle)" />
                )}
              </button>
              <span
                style={{
                  flex: 1,
                  fontSize: "0.875rem",
                  color: item.done ? "var(--text-muted)" : "var(--text)",
                  textDecoration: item.done ? "line-through" : "none",
                }}
              >
                {item.topic}
              </span>
              <Badge variant={priorityColors[item.priority || "média"] || "gray"}>
                {item.priority}
              </Badge>
              <button
                onClick={() => onDelete(item.id)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--danger)", opacity: 0.7 }}
                title="Excluir"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function EditalClient({ initialItems }: { initialItems: EditalItem[] }) {
  const [items, setItems] = useState(initialItems);
  const [isAdding, setIsAdding] = useState(false);

  // Optimistic toggle
  const handleToggle = async (id: string, done: boolean) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, done } : i)));
    await toggleEditalItemAction(id, done);
  };

  const handleDelete = async (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    await deleteEditalItemAction(id);
  };

  const pendingHighPriority = items.filter((i) => !i.done && i.priority === "alta").length;
  const doneItemsCount = items.filter((i) => i.done).length;
  const totalProgress = items.length > 0 ? Math.round((doneItemsCount / items.length) * 100) : 0;

  // Group by Subject
  const subjectsMap = items.reduce((acc, item) => {
    if (!acc[item.subject]) acc[item.subject] = [];
    acc[item.subject].push(item);
    return acc;
  }, {} as Record<string, EditalItem[]>);

  const subjects = Object.keys(subjectsMap).map(subj => {
    const subjItems = subjectsMap[subj];
    const subjDone = subjItems.filter(i => i.done).length;
    return {
      name: subj,
      items: subjItems,
      progress: subjItems.length > 0 ? Math.round((subjDone / subjItems.length) * 100) : 0,
      weight: subjItems[0].weight || 1, // simplified weight assumption
    };
  });

  return (
    <div className="page-container animate-fade-in">
      <Card style={{ marginBottom: 24, background: "linear-gradient(135deg, rgba(39,174,96,0.06), rgba(46,204,113,0.03))", border: "1px solid rgba(39,174,96,0.15)" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <ClipboardList size={20} color="var(--primary)" />
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.125rem", color: "var(--text)" }}>
                Meu Edital
              </h2>
              <Badge variant="green">Em andamento</Badge>
            </div>
            <p style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
              {doneItemsCount} de {items.length} tópicos concluídos
              {pendingHighPriority > 0 && (
                <span style={{ color: "var(--danger)", marginLeft: 8 }}>
                  · {pendingHighPriority} prioridade alta pendentes
                </span>
              )}
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "2rem", color: "var(--primary)" }}>
              {totalProgress}%
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>concluído</div>
          </div>
        </div>
        <div style={{ marginTop: 16 }}>
          <ProgressBar value={totalProgress} size="lg" />
        </div>
      </Card>

      {isAdding && (
        <Card style={{ marginBottom: 24, padding: 20, border: "1px dashed var(--primary)" }}>
          <form
            action={async (formData) => {
              const res = await createEditalItemAction(formData);
              if (res.success) {
                setIsAdding(false);
                // Need to refresh or let server action revalidate page
                window.location.reload();
              }
            }}
          >
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
              <div>
                <Input label="Matéria" name="subject" required placeholder="Ex: Direito Constitucional" />
              </div>
              <div style={{ gridColumn: "span 2" }}>
                <Input label="Tópico" name="topic" required placeholder="Ex: Direitos Fundamentais" />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: 8, fontWeight: 600, fontSize: "0.875rem" }}>Peso</label>
                <select name="weight" className="form-input form-select" style={{ width: "100%", padding: "10px 12px", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", background: "var(--bg-card)", color: "var(--text)" }}>
                  <option value="1">1 (Baixo)</option>
                  <option value="2">2 (Médio)</option>
                  <option value="3">3 (Alto)</option>
                </select>
              </div>
              <div style={{ flex: 1, minWidth: 150 }}>
                <label style={{ fontSize: "0.85rem", fontWeight: 600, display: "block", marginBottom: 6 }}>Prioridade</label>
                <select name="priority" defaultValue="média" className="form-input form-select" style={{ width: "100%", padding: "10px 12px", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", background: "var(--bg-card)", color: "var(--text)" }}>
                  <option value="baixa">Baixa</option>
                  <option value="média">Média</option>
                  <option value="alta">Alta</option>
                </select>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
              <Button variant="primary" type="submit">
                <Save size={16} /> Salvar Tópico
              </Button>
              <Button variant="secondary" onClick={() => setIsAdding(false)}>
                Cancelar
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12, marginBottom: 24 }}>
        {subjects.map((s) => (
          <div key={s.name} className="card" style={{ padding: "14px 16px", textAlign: "center" }}>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.25rem", color: s.progress >= 80 ? "var(--primary)" : s.progress >= 50 ? "var(--accent-dark)" : "var(--danger)" }}>
              {s.progress}%
            </div>
            <div style={{ fontSize: "0.8rem", fontWeight: 500, color: "var(--text)", marginBottom: 8 }}>
              {s.name}
            </div>
            <ProgressBar value={s.progress} size="sm" variant={s.progress >= 80 ? "green" : s.progress >= 50 ? "yellow" : "red"} />
          </div>
        ))}
      </div>

      <div style={{ marginBottom: 12, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1rem", color: "var(--text)" }}>
          Tópicos por Matéria
        </h3>
        <Button variant="secondary" size="sm" id="add-subject-btn" onClick={() => setIsAdding(true)}>
          <Plus size={14} /> Adicionar Tópico
        </Button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {subjects.map((subject) => (
          <SubjectRow 
            key={subject.name} 
            subjectName={subject.name} 
            items={subject.items} 
            weight={subject.weight} 
            onToggle={handleToggle}
            onDelete={handleDelete}
          />
        ))}
        {subjects.length === 0 && !isAdding && (
          <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>
            Nenhum tópico no seu edital. Adicione um novo tópico!
          </div>
        )}
      </div>

      {pendingHighPriority > 0 && (
        <Card style={{ marginTop: 24, padding: 20, background: "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.15)" }}>
          <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            <AlertCircle size={18} color="var(--danger)" style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <div style={{ fontWeight: 600, color: "var(--text)", marginBottom: 4, fontSize: "0.875rem" }}>
                {pendingHighPriority} tópico{pendingHighPriority > 1 ? "s" : ""} de alta prioridade pendente{pendingHighPriority > 1 ? "s" : ""}
              </div>
              <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
                Priorize esses tópicos nas próximas sessões de estudo. Eles têm alto peso na prova.
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
