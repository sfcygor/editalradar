"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { saveSimuladoAnswerAction, finishSimuladoAction } from "@/lib/actions/simulados";
import { useRouter } from "next/navigation";

type SimQuestion = {
  id: string; // simulado_question.id
  question: any;
  selectedAnswer: string | null;
};

export default function SimuladoExecutionClient({
  simuladoId,
  initialQuestions,
}: {
  simuladoId: string;
  initialQuestions: SimQuestion[];
}) {
  const [questions, setQuestions] = useState(initialQuestions);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFinishing, setIsFinishing] = useState(false);
  const router = useRouter();

  const q = questions[currentIndex];
  const qData = q?.question;

  const handleSelectOption = async (letter: string) => {
    // Optimistic update
    const newQuestions = [...questions];
    newQuestions[currentIndex] = { ...q, selectedAnswer: letter };
    setQuestions(newQuestions);

    // Save to DB
    await saveSimuladoAnswerAction(q.id, letter);
  };

  const handleFinish = async () => {
    setIsFinishing(true);
    await finishSimuladoAction(simuladoId);
    router.push("/simulados");
  };

  if (!qData) return <div>Carregando...</div>;

  return (
    <div className="page-container animate-fade-in" style={{ maxWidth: 800, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div style={{ fontSize: "1.1rem", fontWeight: 600 }}>
          Questão {currentIndex + 1} de {questions.length}
        </div>
        <Button variant="primary" onClick={handleFinish} disabled={isFinishing}>
          {isFinishing ? "Finalizando..." : "Finalizar Simulado"}
        </Button>
      </div>

      <div className="progress-bar" style={{ marginBottom: 24 }}>
        <div
          className="progress-fill"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      <Card style={{ padding: 32, marginBottom: 24 }}>
        <div style={{ marginBottom: 16, fontSize: "0.875rem", color: "var(--text-subtle)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          {qData.subject} {qData.topic ? `— ${qData.topic}` : ""}
        </div>
        <p style={{ fontSize: "1.125rem", color: "var(--text)", lineHeight: 1.6, marginBottom: 32 }}>
          {qData.text}
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {(qData.options as { letter: string; text: string }[]).map((opt) => {
            const isSelected = q.selectedAnswer === opt.letter;
            return (
              <button
                key={opt.letter}
                onClick={() => handleSelectOption(opt.letter)}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 16,
                  padding: 16,
                  borderRadius: "var(--radius-md)",
                  border: isSelected ? "2px solid var(--primary)" : "1px solid var(--border)",
                  background: isSelected ? "rgba(39,174,96,0.05)" : "var(--bg-card)",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.2s ease",
                }}
              >
                <span
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    background: isSelected ? "var(--primary)" : "var(--bg-app)",
                    color: isSelected ? "white" : "var(--text-muted)",
                    fontWeight: 700,
                    fontSize: "0.875rem",
                  }}
                >
                  {opt.letter}
                </span>
                <span style={{ fontSize: "0.95rem", color: "var(--text)", lineHeight: 1.5 }}>
                  {opt.text}
                </span>
              </button>
            );
          })}
        </div>
      </Card>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Button
          variant="secondary"
          disabled={currentIndex === 0}
          onClick={() => setCurrentIndex((c) => c - 1)}
        >
          <ArrowLeft size={16} style={{ marginRight: 8 }} />
          Anterior
        </Button>

        {currentIndex < questions.length - 1 ? (
          <Button variant="primary" onClick={() => setCurrentIndex((c) => c + 1)}>
            Próxima
            <ArrowRight size={16} style={{ marginLeft: 8 }} />
          </Button>
        ) : (
          <Button variant="primary" onClick={handleFinish} disabled={isFinishing}>
            <CheckCircle2 size={16} style={{ marginRight: 8 }} />
            Finalizar Simulado
          </Button>
        )}
      </div>
    </div>
  );
}
