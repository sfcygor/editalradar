"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Plus,
  Filter,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronDown,
  BookOpen,
  BarChart2,
  Star,
  Shuffle,
  Edit2,
  Trash2,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";

import { answerQuestionAction, toggleFavoriteQuestionAction, deleteQuestionAction } from "@/lib/actions/questions";

type QuestionType = {
  id: string;
  type: string;
  text: string;
  subject: string;
  topic: string | null;
  difficulty: string;
  options: { letter: string; text: string }[];
  answer: string;
  explanation: string | null;
  status: string;
  isFavorite: boolean | null;
};

// ── Question Card Component ──────────────────────────────────

function QuestionCard({ question }: { question: QuestionType }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(question.status !== "nao-respondida");
  const [isPending, setIsPending] = useState(false);

  const difficultyVariant: Record<string, "green" | "yellow" | "red"> = {
    Fácil: "green",
    Médio: "yellow",
    Difícil: "red",
  };

  return (
    <Card>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 16 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
            <Badge variant="blue">{question.subject}</Badge>
            <Badge variant="gray">{question.topic}</Badge>
            <Badge variant={difficultyVariant[question.difficulty]}>{question.difficulty}</Badge>
            <Badge variant="gray">{question.type === "true_false" ? "Certo/Errado" : "Múltipla Escolha"}</Badge>
          </div>
          <p style={{ fontSize: "0.9rem", lineHeight: 1.6, color: "var(--text)" }}>
            {question.text}
          </p>
        </div>
        <button
          onClick={async () => {
            await toggleFavoriteQuestionAction(question.id);
          }}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: question.isFavorite ? "var(--warning)" : "var(--text-subtle)",
            padding: 4,
          }}
        >
          <Star size={16} fill={question.isFavorite ? "var(--warning)" : "none"} />
        </button>
      </div>

      {/* Options */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
        {question.options.map((opt) => {
          let optClass = "question-option";
          if (revealed) {
            if (opt.letter === question.answer) optClass += " correct";
            else if (opt.letter === selected && selected !== question.answer) optClass += " incorrect";
          } else if (selected === opt.letter) {
            optClass += " selected";
          }

          return (
            <div
              key={opt.letter}
              className={optClass}
              onClick={() => !revealed && setSelected(opt.letter)}
            >
              <span className="option-letter">{opt.letter}</span>
              <span style={{ fontSize: "0.875rem", lineHeight: 1.5 }}>{opt.text}</span>
              {revealed && opt.letter === question.answer && (
                <CheckCircle2 size={16} color="var(--primary)" style={{ marginLeft: "auto", flexShrink: 0 }} />
              )}
              {revealed && opt.letter === selected && selected !== question.answer && (
                <XCircle size={16} color="var(--danger)" style={{ marginLeft: "auto", flexShrink: 0 }} />
              )}
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        {!revealed ? (
          <Button
            variant="primary"
            size="sm"
            onClick={async () => {
              setIsPending(true);
              await answerQuestionAction(question.id, selected!);
              setRevealed(true);
              setIsPending(false);
            }}
            disabled={!selected || isPending}
            id={`reveal-answer-${question.id}`}
          >
            {isPending ? "Aguarde..." : "Verificar Resposta"}
          </Button>
        ) : (
          <div
            style={{
              flex: 1,
              padding: "12px 14px",
              background: "rgba(39,174,96,0.06)",
              borderRadius: "var(--radius-md)",
              border: "1px solid rgba(39,174,96,0.15)",
            }}
          >
            <p style={{ fontSize: "0.8rem", color: "var(--text)", lineHeight: 1.6 }}>
              <strong style={{ color: "var(--primary-dark)" }}>Explicação:</strong>{" "}
              {question.explanation}
            </p>
          </div>
        )}
        <Button variant="secondary" size="sm" icon id={`add-to-errors-${question.id}`}>
          <BookOpen size={14} />
        </Button>
        <Link href={`/questoes/${question.id}/editar`}>
          <Button variant="secondary" size="sm" icon>
            <Edit2 size={14} />
          </Button>
        </Link>
        <Button variant="secondary" size="sm" icon style={{ color: "var(--danger)" }} onClick={async () => {
          if (confirm("Tem certeza que deseja excluir esta questão?")) {
            await deleteQuestionAction(question.id);
          }
        }}>
          <Trash2 size={14} />
        </Button>
      </div>
    </Card>
  );
}

// ── Main Page ────────────────────────────────────────────────

export default function QuestoesClient({ initialQuestions, globalSubjects }: { initialQuestions: QuestionType[], globalSubjects: { id: string; name: string }[] }) {
  const [activeSubject, setActiveSubject] = useState("Todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");

  const subjects = ["Todos", ...globalSubjects.map(s => s.name)];

  const filtered = initialQuestions.filter((q) => {
    const matchSubject = activeSubject === "Todos" || q.subject === activeSubject;
    const matchSearch = q.text.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === "Todos" || q.status === statusFilter;
    return matchSubject && matchSearch && matchStatus;
  });

  const statsRow = [
    { label: "Total", value: initialQuestions.length, color: "var(--text)" },
    { label: "Acertos", value: initialQuestions.filter((q) => q.status === "acerto").length, color: "var(--primary)" },
    { label: "Erros", value: initialQuestions.filter((q) => q.status === "erro").length, color: "var(--danger)" },
    { label: "Pendentes", value: initialQuestions.filter((q) => q.status === "nao-respondida").length, color: "var(--text-muted)" },
  ];

  return (
    <div className="page-container animate-fade-in">
      {/* Top bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", gap: 20 }}>
          {statsRow.map((s) => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.375rem", color: s.color }}>
                {s.value}
              </div>
              <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{s.label}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Button variant="secondary" size="sm" id="shuffle-questions-btn">
            <Shuffle size={14} />
            Aleatório
          </Button>
          <Link href="/questoes/nova">
            <Button variant="primary" size="sm" id="nova-questao-btn">
              <Plus size={14} />
              Nova Questão
            </Button>
          </Link>
        </div>
      </div>

      {/* Subject Filter Tabs */}
      <div style={{ overflowX: "auto", marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 8, paddingBottom: 4 }}>
          {subjects.map((s) => (
            <button
              key={s}
              onClick={() => setActiveSubject(s)}
              style={{
                padding: "6px 14px",
                borderRadius: "var(--radius-full)",
                border: "1.5px solid",
                borderColor: activeSubject === s ? "var(--primary)" : "var(--border)",
                background: activeSubject === s ? "rgba(39,174,96,0.08)" : "white",
                color: activeSubject === s ? "var(--primary-dark)" : "var(--text-muted)",
                fontWeight: activeSubject === s ? 600 : 400,
                fontSize: "0.8rem",
                cursor: "pointer",
                transition: "all var(--transition-fast)",
                whiteSpace: "nowrap",
                fontFamily: "var(--font-sans)",
              }}
              id={`filter-subject-${s}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Search + Status Filter */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div className="search-input-wrapper">
            <Search className="search-icon" size={16} />
            <input
              type="text"
              className="search-input"
              style={{ borderRadius: "var(--radius-md)" }}
              placeholder="Buscar questões..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              id="questoes-search"
            />
          </div>
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="form-input form-select"
          style={{ width: "auto", minWidth: 140 }}
          id="questoes-status-filter"
        >
          <option value="Todos">Todos os status</option>
          <option value="acerto">Acertos</option>
          <option value="erro">Erros</option>
          <option value="nao-respondida">Não respondidas</option>
        </select>
        <Button variant="secondary" size="md" id="advanced-filter-btn">
          <Filter size={14} />
          Filtros
        </Button>
      </div>

      {/* Results count */}
      <div style={{ marginBottom: 16, fontSize: "0.8rem", color: "var(--text-muted)" }}>
        {filtered.length} questão{filtered.length !== 1 ? "ões" : ""} encontrada{filtered.length !== 1 ? "s" : ""}
      </div>

      {/* Questions List */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {filtered.map((q) => (
          <QuestionCard key={q.id} question={q} />
        ))}
        {filtered.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">
              <BookOpen size={32} />
            </div>
            <div className="empty-state-title">Nenhuma questão encontrada</div>
            <p className="empty-state-desc">Tente ajustar seus filtros ou crie uma nova questão.</p>
            <Link href="/questoes/nova">
              <Button variant="primary" id="create-first-question-btn">
                <Plus size={16} />
                Criar Questão
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
