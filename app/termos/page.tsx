import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { AuthModalProvider } from "@/components/auth/AuthModalProvider";
import { Suspense } from "react";
import { getSession } from "@/lib/session";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export default async function TermosDeUso() {
  const session = await getSession();
  let user = null;
  if (session?.userId) {
    const res = await db().select().from(users).where(eq(users.id, session.userId)).limit(1);
    if (res.length > 0) user = res[0];
  }

  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <AuthModalProvider>
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#f8fafc" }}>
          <Header user={user} />

          <main style={{ flex: 1, paddingTop: 120, paddingBottom: 80 }}>
            <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px" }}>

              <div style={{ background: "#ffffff", borderRadius: 24, padding: "clamp(32px, 5vw, 64px)", boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}>
                <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 800, color: "#0f172a", marginBottom: 16 }}>
                  Termos de Uso – EditalRadar
                </h1>
                <p style={{ color: "#64748b", fontSize: 15, marginBottom: 48 }}>
                  Última atualização: <strong style={{ color: "#334155" }}>03/06/2026</strong>
                </p>

                <div className="prose prose-slate max-w-none" style={{ color: "#334155", lineHeight: 1.8 }}>
                  <p>
                    Bem-vindo ao EditalRadar. Ao acessar ou utilizar a plataforma, você concorda com os presentes Termos de Uso. Caso não concorde com qualquer condição aqui descrita, recomendamos que não utilize nossos serviços.
                  </p>

                  <h2 style={{ fontSize: 24, fontWeight: 700, color: "#0f172a", marginTop: 40, marginBottom: 16 }}>1. Sobre o EditalRadar</h2>
                  <p>
                    O EditalRadar é uma plataforma voltada para organização, acompanhamento e otimização dos estudos, oferecendo ferramentas como registro de horas estudadas, metas, estatísticas, simulados, revisões, flashcards e outros recursos relacionados à produtividade acadêmica.
                  </p>

                  <h2 style={{ fontSize: 24, fontWeight: 700, color: "#0f172a", marginTop: 40, marginBottom: 16 }}>2. Cadastro de Usuários</h2>
                  <p>
                    Para utilizar determinadas funcionalidades, o usuário deverá criar uma conta fornecendo informações verdadeiras e atualizadas.
                  </p>
                  <p>O usuário é responsável por:</p>
                  <ul style={{ listStyleType: "disc", paddingLeft: 24, marginBottom: 16 }}>
                    <li>Manter a confidencialidade de sua senha.</li>
                    <li>Não compartilhar sua conta com terceiros.</li>
                    <li>Informar imediatamente qualquer uso não autorizado de sua conta.</li>
                  </ul>

                  <h2 style={{ fontSize: 24, fontWeight: 700, color: "#0f172a", marginTop: 40, marginBottom: 16 }}>3. Planos e Assinaturas</h2>
                  <p>
                    O EditalRadar poderá disponibilizar planos gratuitos e pagos.
                  </p>
                  <p>
                    Os recursos disponíveis variam conforme o plano contratado. Os valores, benefícios e condições dos planos poderão ser alterados futuramente, respeitando as obrigações legais aplicáveis.
                  </p>

                  <h2 style={{ fontSize: 24, fontWeight: 700, color: "#0f172a", marginTop: 40, marginBottom: 16 }}>4. Uso Adequado da Plataforma</h2>
                  <p>
                    O usuário compromete-se a utilizar a plataforma de forma lícita e adequada.
                  </p>
                  <p>É proibido:</p>
                  <ul style={{ listStyleType: "disc", paddingLeft: 24, marginBottom: 16 }}>
                    <li>Tentar acessar áreas não autorizadas do sistema.</li>
                    <li>Realizar engenharia reversa do software.</li>
                    <li>Utilizar bots ou ferramentas automatizadas para explorar a plataforma.</li>
                    <li>Praticar qualquer atividade que prejudique o funcionamento do serviço.</li>
                  </ul>

                  <h2 style={{ fontSize: 24, fontWeight: 700, color: "#0f172a", marginTop: 40, marginBottom: 16 }}>5. Disponibilidade do Serviço</h2>
                  <p>
                    Embora busquemos manter a plataforma disponível continuamente, não garantimos disponibilidade ininterrupta.
                  </p>
                  <p>
                    Poderão ocorrer interrupções para manutenção, atualizações ou situações técnicas imprevistas.
                  </p>

                  <h2 style={{ fontSize: 24, fontWeight: 700, color: "#0f172a", marginTop: 40, marginBottom: 16 }}>6. Propriedade Intelectual</h2>
                  <p>
                    Todos os elementos da plataforma, incluindo design, logotipos, funcionalidades, textos e códigos, pertencem ao EditalRadar ou aos seus respectivos titulares.
                  </p>
                  <p>
                    É proibida a reprodução, distribuição ou utilização sem autorização prévia.
                  </p>

                  <h2 style={{ fontSize: 24, fontWeight: 700, color: "#0f172a", marginTop: 40, marginBottom: 16 }}>7. Limitação de Responsabilidade</h2>
                  <p>
                    O EditalRadar atua como ferramenta de apoio aos estudos.
                  </p>
                  <p>
                    Não garantimos aprovação em concursos, exames ou processos seletivos. Os resultados obtidos dependem de fatores individuais de cada usuário.
                  </p>

                  <h2 style={{ fontSize: 24, fontWeight: 700, color: "#0f172a", marginTop: 40, marginBottom: 16 }}>8. Cancelamento e Encerramento de Conta</h2>
                  <p>
                    O usuário poderá solicitar o encerramento de sua conta a qualquer momento.
                  </p>
                  <p>
                    O EditalRadar também poderá suspender ou encerrar contas que violem estes Termos de Uso.
                  </p>

                  <h2 style={{ fontSize: 24, fontWeight: 700, color: "#0f172a", marginTop: 40, marginBottom: 16 }}>9. Alterações nos Termos</h2>
                  <p>
                    Estes Termos poderão ser atualizados periodicamente. A continuidade do uso da plataforma após alterações será considerada como aceitação das novas condições.
                  </p>

                  <h2 style={{ fontSize: 24, fontWeight: 700, color: "#0f172a", marginTop: 40, marginBottom: 16 }}>10. Contato</h2>
                  <p>
                    Em caso de dúvidas, sugestões ou solicitações relacionadas a estes Termos de Uso, entre em contato através do e-mail:
                    <br />
                    <a href="mailto:editalradarsup@gmail.com" style={{ color: "#10b981", textDecoration: "none", fontWeight: 600 }}>editalradarsup@gmail.com</a>
                  </p>

                  <h2 style={{ fontSize: 24, fontWeight: 700, color: "#0f172a", marginTop: 40, marginBottom: 16 }}>11. Foro</h2>
                  <p>
                    Fica eleito o foro da comarca do domicílio do responsável pela plataforma, observadas as disposições da legislação brasileira aplicável, para resolução de eventuais controvérsias relacionadas a estes Termos de Uso.
                  </p>
                </div>
              </div>

            </div>
          </main>

          <Footer />
        </div>
      </AuthModalProvider>
    </Suspense>
  );
}
