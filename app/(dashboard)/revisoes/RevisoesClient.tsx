"use client";

import { useState } from "react";
import Link from "next/link";
import { Play, CheckCircle2, XCircle, ChevronLeft, Zap, RefreshCw } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/Badge";
import { reviewFlashcardAction } from "@/lib/actions/flashcards";
import { Flashcard, FlashcardReview } from "@/lib/db/schema";

type DueCard = {
  review: FlashcardReview;
  card: Flashcard;
};

export default function RevisoesClient({ initialDueCards }: { initialDueCards: DueCard[] }) {
  const [activeTab, setActiveTab] = useState<"pendentes" | "todas" | "atrasadas">("pendentes");
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pendingReviews = initialDueCards;
  
  if (started) {
    if (currentIndex >= pendingReviews.length) {
      return (
        <div className="page-container animate-fade-in" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", textAlign: "center" }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(39, 174, 96, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
            <CheckCircle2 size={32} color="var(--primary)" />
          </div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--text)", marginBottom: 12 }}>
            Sessão Concluída!
          </h2>
          <p style={{ color: "var(--text-muted)", marginBottom: 24, maxWidth: 400, lineHeight: 1.6 }}>
            Você revisou todos os flashcards programados para hoje. Excelente trabalho!
          </p>
          <Button variant="primary" onClick={() => window.location.reload()}>
            Voltar ao Início
          </Button>
        </div>
      );
    }

    const currentCard = pendingReviews[currentIndex];
    const progress = (currentIndex / pendingReviews.length) * 100;

    const handleReview = async (quality: 0 | 1 | 2 | 3 | 4 | 5) => {
      setIsSubmitting(true);
      await reviewFlashcardAction(currentCard.card.id, quality);
      setIsSubmitting(false);

      setFlipped(false);
      setCurrentIndex(currentIndex + 1);
    };

    return (
      <div className="page-container animate-fade-in">
        {/* Top bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <Button variant="secondary" size="sm" onClick={() => setStarted(false)}>
            <ChevronLeft size={16} /> Voltar
          </Button>
          <div style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
            Card {currentIndex + 1} de {pendingReviews.length}
          </div>
        </div>

        {/* Progress */}
        <div style={{ marginBottom: 24 }}>
          <ProgressBar value={progress} />
        </div>

        {/* Card Viewer */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Card style={{ width: "100%", maxWidth: 800, minHeight: 400, display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", flexDirection: "column", flex: 1, padding: 32 }}>
              
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text)" }}>Deck ID: {currentCard.card.deckId.substring(0, 8)}</h3>
              </div>
              
              <div style={{ display: "flex", gap: 32, flex: 1 }}>
                {/* Front */}
                <div style={{ flex: 1, borderRight: flipped ? "1px solid var(--border)" : "none", paddingRight: flipped ? 32 : 0 }}>
                  <h4 style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: 1, color: "var(--text-subtle)", marginBottom: 16 }}>Frente</h4>
                  <p style={{ fontSize: "1.2rem", lineHeight: 1.6, color: "var(--text)" }}>
                    {currentCard.card.front}
                  </p>
                </div>

                {/* Back */}
                <div style={{ flex: 1, position: "relative" }}>
                  {!flipped ? (
                    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Button variant="primary" size="lg" onClick={() => setFlipped(true)}>
                        Ver Resposta
                      </Button>
                    </div>
                  ) : (
                    <div className="animate-fade-in" style={{ padding: 24, background: "rgba(39, 174, 96, 0.05)", borderRadius: "var(--radius-lg)", border: "1px solid rgba(39, 174, 96, 0.15)", height: "100%" }}>
                      <h4 style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: 1, color: "var(--primary-dark)", marginBottom: 16 }}>Verso</h4>
                      <p style={{ fontSize: "1.2rem", lineHeight: 1.6, color: "var(--text)" }}>
                        {currentCard.card.back}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div style={{ padding: "20px 32px", borderTop: "1px solid var(--border)", background: "var(--bg-secondary)", borderBottomLeftRadius: "inherit", borderBottomRightRadius: "inherit" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Button variant="secondary" onClick={() => setStarted(false)}>Encerrar Sessão</Button>
                {flipped && (
                  <div style={{ display: "flex", gap: 8 }}>
                    <Button variant="secondary" disabled={isSubmitting} onClick={() => handleReview(1)} style={{ color: "var(--danger)", borderColor: "var(--danger)" }}>
                      Errei
                    </Button>
                    <Button variant="secondary" disabled={isSubmitting} onClick={() => handleReview(3)} style={{ color: "var(--warning)", borderColor: "var(--warning)" }}>
                      Difícil
                    </Button>
                    <Button variant="secondary" disabled={isSubmitting} onClick={() => handleReview(4)} style={{ color: "var(--primary)", borderColor: "var(--primary)" }}>
                      Bom
                    </Button>
                    <Button variant="secondary" disabled={isSubmitting} onClick={() => handleReview(5)} style={{ color: "var(--info)", borderColor: "var(--info)" }}>
                      Fácil
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  const now = new Date();
  const todayString = now.toDateString();

  const overdue = pendingReviews.filter((r) => r.review.nextReview && new Date(r.review.nextReview) < now && new Date(r.review.nextReview).toDateString() !== todayString);
  const dueToday = pendingReviews.filter((r) => r.review.nextReview && new Date(r.review.nextReview).toDateString() === todayString);
  
  const pendentes = pendingReviews.filter((r) => {
    if (!r.review.nextReview) return false;
    const revDate = new Date(r.review.nextReview);
    return revDate < now || revDate.toDateString() === todayString;
  });

  const shown =
    activeTab === "atrasadas"
      ? overdue
      : activeTab === "pendentes"
      ? pendentes
      : pendingReviews;

  return (
    <div className="page-container animate-fade-in">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>
            Revisões (SM-2)
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
            Você tem <strong style={{ color: "var(--primary)" }}>{overdue.length + dueToday.length}</strong> cards pendentes.
          </p>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          {["pendentes", "atrasadas", "todas"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              style={{ padding: "8px 16px", borderRadius: "var(--radius-full)", border: "none", background: activeTab === tab ? "var(--primary)" : "var(--bg-secondary)", color: activeTab === tab ? "white" : "var(--text)", cursor: "pointer", fontSize: "0.85rem", fontWeight: 500, transition: "all var(--transition-fast)" }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        <Button variant="primary" id="start-all-reviews-btn" onClick={() => setStarted(true)} disabled={shown.length === 0}>
          <Zap size={14} />
          Iniciar Revisão ({shown.length} cards)
        </Button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {shown.map((r) => (
          <Card key={r.card.id} style={{ padding: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: "var(--radius-md)", background: "rgba(39,174,96,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <RefreshCw size={20} color="var(--primary)" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
                  <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.9rem", color: "var(--text)" }}>
                    {r.card.front.substring(0, 60)}...
                  </h3>
                </div>
                <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    Facilidade: {r.review.easiness.toFixed(1)}
                  </span>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    Intervalo: {r.review.interval} dias
                  </span>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, flexShrink: 0 }}>
                <Button variant="primary" size="sm" onClick={() => setStarted(true)}>
                  <Play size={14} />
                  Revisar
                </Button>
              </div>
            </div>
          </Card>
        ))}
        {shown.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon"><CheckCircle2 size={32} /></div>
            <div className="empty-state-title">Tudo em dia!</div>
            <p className="empty-state-desc">Você não possui revisões pendentes para esta categoria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
