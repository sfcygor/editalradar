"use client";

import { useState } from "react";
import { Plus, CheckCircle2, Clock, FileQuestion, BookOpen, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { createGoalAction, deleteGoalAction } from "@/lib/actions/goals";

type GoalData = {
  id: string;
  label: string;
  targetType: string;
  targetValue: number;
  period: string;
  currentValue: number;
  progressPct: number;
  isCompleted: boolean;
};

const iconMap: Record<string, any> = {
  questions: FileQuestion,
  time_minutes: Clock,
  flashcards: BookOpen,
};

const colorMap: Record<string, string> = {
  questions: "var(--primary)",
  time_minutes: "var(--info)",
  flashcards: "var(--accent-dark)",
};

const unitMap: Record<string, string> = {
  questions: "questões",
  time_minutes: "min",
  flashcards: "cards",
};

export default function MetasClient({ initialGoals }: { initialGoals: GoalData[] }) {
  const [period, setPeriod] = useState<string>("daily");
  const [isAdding, setIsAdding] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filtered = initialGoals.filter((g) => g.period === period);
  const completedCount = filtered.filter((g) => g.isCompleted).length;
  const totalCount = filtered.length;

  return (
    <div className="page-container animate-fade-in">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
            <strong style={{ color: "var(--primary)" }}>{completedCount}</strong> de{" "}
            <strong>{totalCount}</strong> metas concluídas hoje
          </p>
        </div>
        <Button variant="primary" size="sm" id="add-goal-btn" onClick={() => setIsAdding(true)}>
          <Plus size={14} />
          Nova Meta
        </Button>
      </div>

      <div className="tabs" style={{ marginBottom: 24, width: "auto", display: "inline-flex" }}>
        {[
          { id: "daily", label: "Diário" },
          { id: "weekly", label: "Semanal" },
          { id: "forever", label: "Geral" },
        ].map((p) => (
          <button
            key={p.id}
            className={`tab ${period === p.id ? "active" : ""}`}
            onClick={() => setPeriod(p.id)}
            id={`tab-metas-${p.id}`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <Card style={{ marginBottom: 24, padding: 24, background: "linear-gradient(135deg, rgba(39,174,96,0.06), rgba(46,204,113,0.03))", border: "1px solid rgba(39,174,96,0.15)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "conic-gradient(var(--primary) 0deg, var(--primary) " + (totalCount > 0 ? Math.round((completedCount / totalCount) * 360) : 0) + "deg, var(--bg-secondary) " + (totalCount > 0 ? Math.round((completedCount / totalCount) * 360) : 0) + "deg)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <div style={{ width: 60, height: 60, borderRadius: "50%", background: "white", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1rem", color: "var(--primary)" }}>
                {totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0}%
              </span>
            </div>
          </div>
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.25rem", color: "var(--text)", marginBottom: 4 }}>
              Progresso {period === "daily" ? "de Hoje" : period === "weekly" ? "da Semana" : "Geral"}
            </div>
            <p style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
              {totalCount === 0 
                ? "Nenhuma meta definida" 
                : completedCount === totalCount
                ? "🎉 Todas as metas concluídas!"
                : `Faltam ${totalCount - completedCount} meta${totalCount - completedCount > 1 ? "s" : ""} para concluir`}
            </p>
          </div>
        </div>
      </Card>

      {isAdding && (
        <Card style={{ marginBottom: 24, padding: 20, border: "1px dashed var(--primary)" }}>
          <form
            action={async (formData) => {
              setIsSubmitting(true);
              await createGoalAction(formData);
              setIsSubmitting(false);
              setIsAdding(false);
            }}
          >
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <Input label="Título da Meta" name="label" required placeholder="Ex: Resolver 50 questões" />
              
              <div>
                <label style={{ display: "block", marginBottom: 8, fontWeight: 600, fontSize: "0.875rem" }}>Tipo</label>
                <select name="targetType" className="form-input form-select" style={{ width: "100%", padding: "10px 12px", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", background: "var(--bg-card)", color: "var(--text)" }}>
                  <option value="questions">Questões Respondidas</option>
                  <option value="time_minutes">Tempo de Estudo (minutos)</option>
                  <option value="flashcards">Flashcards Revisados</option>
                </select>
              </div>

              <Input label="Quantidade Alvo" name="targetValue" type="number" required placeholder="Ex: 50" />

              <div>
                <label style={{ display: "block", marginBottom: 8, fontWeight: 600, fontSize: "0.875rem" }}>Frequência</label>
                <select name="period" className="form-input form-select" style={{ width: "100%", padding: "10px 12px", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", background: "var(--bg-card)", color: "var(--text)" }}>
                  <option value="daily">Diária (reseta à meia-noite)</option>
                  <option value="weekly">Semanal (reseta segunda-feira)</option>
                  <option value="forever">Geral (não reseta)</option>
                </select>
              </div>
            </div>
            <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
              <Button variant="primary" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Salvando..." : "Salvar Meta"}
              </Button>
              <Button variant="secondary" onClick={() => setIsAdding(false)}>Cancelar</Button>
            </div>
          </form>
        </Card>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
        {filtered.map((goal) => {
          const Icon = iconMap[goal.targetType] || FileQuestion;
          const color = colorMap[goal.targetType] || "var(--text)";
          const unit = unitMap[goal.targetType] || "";

          return (
            <Card key={goal.id} style={{ padding: 22 }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: "var(--radius-md)",
                      background: goal.isCompleted ? "rgba(39,174,96,0.1)" : `${color}12`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {goal.isCompleted ? (
                      <CheckCircle2 size={22} color="var(--primary)" />
                    ) : (
                      <Icon size={22} color={color} strokeWidth={1.8} />
                    )}
                  </div>
                  <div>
                    <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.875rem", color: "var(--text)" }}>
                      {goal.label}
                    </div>
                    <Badge variant={goal.isCompleted ? "green" : "gray"} style={{ marginTop: 4, fontSize: "0.65rem" }}>
                      {goal.period === "daily" ? "Diário" : goal.period === "weekly" ? "Semanal" : "Geral"}
                    </Badge>
                  </div>
                </div>
                <form action={async () => { await deleteGoalAction(goal.id); }}>
                  <button type="submit" style={{ background: "none", border: "none", cursor: "pointer", color: "var(--danger)", opacity: 0.6, padding: 4 }}>
                    <Trash2 size={14} />
                  </button>
                </form>
              </div>

              <div style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: "2rem", fontFamily: "var(--font-display)", fontWeight: 700, color: goal.isCompleted ? "var(--primary)" : "var(--text)", lineHeight: 1 }}>
                    {goal.currentValue}
                  </span>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>de {goal.targetValue}</div>
                    <div style={{ fontSize: "0.7rem", color: "var(--text-subtle)" }}>{unit}</div>
                  </div>
                </div>
                <ProgressBar
                  value={goal.progressPct}
                  variant={goal.isCompleted ? "green" : goal.progressPct >= 60 ? "blue" : "yellow"}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                  {goal.isCompleted ? "✅ Concluída!" : `Faltam ${Math.max(0, goal.targetValue - goal.currentValue)} ${unit}`}
                </span>
                <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.875rem", color: goal.isCompleted ? "var(--primary)" : "var(--text)" }}>
                  {goal.progressPct}%
                </span>
              </div>
            </Card>
          );
        })}

        {!isAdding && (
          <div
            className="card"
            style={{
              padding: 22,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              border: "2px dashed var(--border)",
              background: "transparent",
              boxShadow: "none",
              cursor: "pointer",
              minHeight: 180,
            }}
            onClick={() => setIsAdding(true)}
            id="add-new-goal-card"
          >
            <div style={{ width: 44, height: 44, borderRadius: "var(--radius-md)", background: "rgba(39,174,96,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Plus size={24} color="var(--primary)" />
            </div>
            <span style={{ fontWeight: 600, color: "var(--text-muted)", fontSize: "0.875rem" }}>Nova Meta</span>
          </div>
        )}
      </div>
    </div>
  );
}
