import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { AuthModalProvider } from "@/components/auth/AuthModalProvider";
import { Suspense } from "react";
import { getSession } from "@/lib/session";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export default async function PoliticaDePrivacidade() {
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
                  Política de Privacidade – EditalRadar
                </h1>
                <p style={{ color: "#64748b", fontSize: 15, marginBottom: 48 }}>
                  Última atualização: <strong style={{ color: "#334155" }}>03/06/2026</strong>
                </p>

                <div className="prose prose-slate max-w-none" style={{ color: "#334155", lineHeight: 1.8 }}>
                  <p>
                    O EditalRadar respeita sua privacidade e está comprometido em proteger os dados pessoais de seus usuários. Esta Política de Privacidade explica como coletamos, utilizamos, armazenamos e protegemos suas informações ao utilizar nossa plataforma.
                  </p>

                  <h2 style={{ fontSize: 24, fontWeight: 700, color: "#0f172a", marginTop: 40, marginBottom: 16 }}>1. Informações Coletadas</h2>
                  <p>Podemos coletar as seguintes informações:</p>

                  <h3 style={{ fontSize: 18, fontWeight: 600, color: "#1e293b", marginTop: 24, marginBottom: 12 }}>Informações fornecidas pelo usuário</h3>
                  <ul style={{ listStyleType: "disc", paddingLeft: 24, marginBottom: 16 }}>
                    <li>Nome;</li>
                    <li>Endereço de e-mail;</li>
                    <li>Dados de autenticação;</li>
                    <li>Informações inseridas na plataforma, como metas, matérias, registros de estudo, simulados, revisões e demais conteúdos relacionados ao uso do serviço.</li>
                  </ul>

                  <h3 style={{ fontSize: 18, fontWeight: 600, color: "#1e293b", marginTop: 24, marginBottom: 12 }}>Informações coletadas automaticamente</h3>
                  <ul style={{ listStyleType: "disc", paddingLeft: 24, marginBottom: 16 }}>
                    <li>Endereço IP;</li>
                    <li>Tipo de navegador;</li>
                    <li>Sistema operacional;</li>
                    <li>Informações de acesso e navegação;</li>
                    <li>Dados de desempenho e segurança da plataforma.</li>
                  </ul>

                  <h2 style={{ fontSize: 24, fontWeight: 700, color: "#0f172a", marginTop: 40, marginBottom: 16 }}>2. Como Utilizamos Seus Dados</h2>
                  <p>As informações coletadas podem ser utilizadas para:</p>
                  <ul style={{ listStyleType: "disc", paddingLeft: 24, marginBottom: 16 }}>
                    <li>Fornecer e manter os serviços do EditalRadar;</li>
                    <li>Gerenciar contas de usuários;</li>
                    <li>Personalizar a experiência na plataforma;</li>
                    <li>Melhorar funcionalidades e desempenho;</li>
                    <li>Prevenir fraudes e atividades indevidas;</li>
                    <li>Cumprir obrigações legais e regulatórias;</li>
                    <li>Entrar em contato quando necessário.</li>
                  </ul>

                  <h2 style={{ fontSize: 24, fontWeight: 700, color: "#0f172a", marginTop: 40, marginBottom: 16 }}>3. Pagamentos</h2>
                  <p>
                    Os pagamentos realizados na plataforma são processados por provedores terceirizados especializados. O EditalRadar não armazena números completos de cartões de crédito ou informações financeira sensíveis dos usuários. As transações seguem os padrões de segurança adotados pelos respectivos processadores de pagamento.
                  </p>

                  <h2 style={{ fontSize: 24, fontWeight: 700, color: "#0f172a", marginTop: 40, marginBottom: 16 }}>4. Compartilhamento de Dados</h2>
                  <p>
                    O EditalRadar não vende dados pessoais. As informações poderão ser compartilhadas apenas nas seguintes situações:
                  </p>
                  <ul style={{ listStyleType: "disc", paddingLeft: 24, marginBottom: 16 }}>
                    <li>Com prestadores de serviço necessários para operação da plataforma;</li>
                    <li>Quando exigido por lei, decisão judicial ou autoridade competente;</li>
                    <li>Para proteção dos direitos, segurança ou integridade da plataforma e de seus usuários.</li>
                  </ul>

                  <h2 style={{ fontSize: 24, fontWeight: 700, color: "#0f172a", marginTop: 40, marginBottom: 16 }}>5. Armazenamento e Segurança</h2>
                  <p>
                    Adotamos medidas técnicas e organizacionais razoáveis para proteger as informações contra acesso não autorizado, perda, alteração ou divulgação indevida. Apesar dos esforços de segurança, nenhum sistema é completamente imune a riscos.
                  </p>

                  <h2 style={{ fontSize: 24, fontWeight: 700, color: "#0f172a", marginTop: 40, marginBottom: 16 }}>6. Retenção dos Dados</h2>
                  <p>
                    Os dados serão mantidos enquanto forem necessários para a prestação dos serviços, cumprimento de obrigações legais ou proteção de interesses legítimos da plataforma.
                  </p>

                  <h2 style={{ fontSize: 24, fontWeight: 700, color: "#0f172a", marginTop: 40, marginBottom: 16 }}>7. Direitos dos Usuários</h2>
                  <p>
                    Nos termos da legislação aplicável, incluindo a Lei Geral de Proteção de Dados (LGPD), o usuário poderá solicitar:
                  </p>
                  <ul style={{ listStyleType: "disc", paddingLeft: 24, marginBottom: 16 }}>
                    <li>Acesso aos seus dados pessoais;</li>
                    <li>Correção de informações incorretas;</li>
                    <li>Exclusão de dados, quando aplicável;</li>
                    <li>Revogação de consentimentos concedidos;</li>
                    <li>Informações sobre o tratamento de seus dados.</li>
                  </ul>

                  <h2 style={{ fontSize: 24, fontWeight: 700, color: "#0f172a", marginTop: 40, marginBottom: 16 }}>8. Cookies e Tecnologias Semelhantes</h2>
                  <p>
                    O EditalRadar poderá utilizar cookies e tecnologias similares para manter sessões autenticadas, melhorar a navegação, analisar o desempenho da plataforma e garantir funcionalidades essenciais. O usuário pode gerenciar cookies diretamente em seu navegador.
                  </p>

                  <h2 style={{ fontSize: 24, fontWeight: 700, color: "#0f172a", marginTop: 40, marginBottom: 16 }}>9. Serviços de Terceiros</h2>
                  <p>
                    A plataforma poderá utilizar serviços de terceiros para hospedagem, autenticação, processamento de pagamentos, análise de desempenho e infraestrutura. Esses serviços possuem políticas próprias de privacidade e tratamento de dados.
                  </p>

                  <h2 style={{ fontSize: 24, fontWeight: 700, color: "#0f172a", marginTop: 40, marginBottom: 16 }}>10. Alterações nesta Política</h2>
                  <p>
                    Esta Política de Privacidade poderá ser atualizada periodicamente para refletir mudanças legais, operacionais ou tecnológicas. A versão mais recente estará sempre disponível na plataforma.
                  </p>

                  <h2 style={{ fontSize: 24, fontWeight: 700, color: "#0f172a", marginTop: 40, marginBottom: 16 }}>11. Contato</h2>
                  <p>
                    Para dúvidas, solicitações ou questões relacionadas à privacidade e proteção de dados, entre em contato:
                    <br />
                    E-mail: <a href="mailto:editalradarsup@gmail.com" style={{ color: "#10b981", textDecoration: "none", fontWeight: 600 }}>editalradarsup@gmail.com</a>
                  </p>

                  <h2 style={{ fontSize: 24, fontWeight: 700, color: "#0f172a", marginTop: 40, marginBottom: 16 }}>12. Legislação Aplicável</h2>
                  <p>
                    Esta Política de Privacidade será regida pelas leis da República Federativa do Brasil, especialmente pela Lei nº 13.709/2018 (Lei Geral de Proteção de Dados Pessoais – LGPD).
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
