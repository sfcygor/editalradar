import { redirect } from "next/navigation";
import { createSimuladoAction } from "@/lib/actions/simulados";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ArrowLeft, Play } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/Input";

import { getSubjects } from "@/lib/actions/subjects";

export default async function NovoSimuladoPage() {
  const { subjects = [] } = await getSubjects();
  
  return (
    <div className="page-container animate-fade-in">
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <Link href="/simulados">
          <Button variant="secondary" size="sm" icon>
            <ArrowLeft size={16} />
          </Button>
        </Link>
        <div>
          <h1 className="page-title" style={{ marginBottom: 0 }}>Novo Simulado</h1>
          <p className="page-subtitle">Configure um simulado personalizado</p>
        </div>
      </div>

      <Card style={{ padding: 24, maxWidth: 800 }}>
        <form
          action={async (formData) => {
            "use server";
            const res = await createSimuladoAction(formData);
            if (res?.success) {
              redirect(`/simulados/${res.simuladoId}/execucao`);
            }
          }}
          style={{ display: "flex", flexDirection: "column", gap: 20 }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div className="form-group">
              <label className="form-label" style={{ display: "block", marginBottom: 8, fontWeight: 600, fontSize: "0.875rem" }}>Nome do Simulado</label>
              <Input name="name" required placeholder="Ex: Simulado PM-SP #2" />
            </div>
            
            <div className="form-group">
              <label className="form-label" style={{ display: "block", marginBottom: 8, fontWeight: 600, fontSize: "0.875rem" }}>Número de Questões</label>
              <select name="totalQuestions" className="form-input form-select" style={{
                width: "100%", padding: "10px 12px", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", background: "var(--bg-card)", color: "var(--text)",
              }}>
                <option value="10">10 questões</option>
                <option value="20">20 questões</option>
                <option value="30">30 questões</option>
                <option value="50">50 questões</option>
                <option value="100">100 questões</option>
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label" style={{ display: "block", marginBottom: 8, fontWeight: 600, fontSize: "0.875rem" }}>Tempo Limite (minutos)</label>
              <select name="durationMinutes" className="form-input form-select" style={{
                width: "100%", padding: "10px 12px", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", background: "var(--bg-card)", color: "var(--text)",
              }}>
                <option value="30">30 minutos</option>
                <option value="60">60 minutos</option>
                <option value="120">120 minutos</option>
                <option value="240">240 minutos</option>
                <option value="">Sem limite</option>
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label" style={{ display: "block", marginBottom: 8, fontWeight: 600, fontSize: "0.875rem" }}>Matéria</label>
              <select name="subject" className="form-input form-select" style={{
                width: "100%", padding: "10px 12px", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", background: "var(--bg-card)", color: "var(--text)",
              }}>
                <option value="Todas as Matérias">Todas as matérias</option>
                {subjects.map(s => (
                  <option key={s.id} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
            <Button variant="primary" type="submit">
              <Play size={16} />
              Gerar e Iniciar Simulado
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
