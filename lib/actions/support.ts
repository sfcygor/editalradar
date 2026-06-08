"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function submitSupportTicketAction(formData: FormData) {
  try {
    const type = formData.get("type") as string;
    const subject = formData.get("subject") as string;
    const description = formData.get("description") as string;
    const userEmail = formData.get("userEmail") as string;
    const userAgent = formData.get("userAgent") as string;
    const isLoggedIn = formData.get("isLoggedIn") === "true";
    const currentUrl = formData.get("currentUrl") as string;

    if (!subject || !description || !userEmail) {
      return { success: false, error: "Por favor, preencha os campos obrigatórios." };
    }

    if (!process.env.RESEND_API_KEY) {
      console.warn("RESEND_API_KEY não encontrada. Simulando envio com sucesso.");
      // Se não tiver chave (como em ambiente local de teste), podemos apenas simular sucesso para não travar
      // Em produção, isso lançaria um erro se quisessemos garantir.
      return { success: true };
    }

    const htmlContent = `
      <h2>Novo Ticket de Suporte: ${type}</h2>
      <p><strong>Assunto:</strong> ${subject}</p>
      <p><strong>De:</strong> ${userEmail} ${isLoggedIn ? "(Usuário Logado)" : "(Visitante)"}</p>
      <p><strong>URL de Origem:</strong> ${currentUrl || "N/A"}</p>
      <hr />
      <h3>Descrição do Problema / Feedback:</h3>
      <p style="white-space: pre-wrap;">${description}</p>
      <hr />
      <h3>Informações Técnicas:</h3>
      <p><strong>Navegador / OS:</strong> ${userAgent}</p>
      <p><strong>Data:</strong> ${new Date().toLocaleString("pt-BR")}</p>
    `;

    const { data, error } = await resend.emails.send({
      from: "EditalRadar Suporte <onboarding@resend.dev>", // Usando sandbox do Resend
      to: ["lopesygor091@gmail.com"],
      subject: `[EditalRadar - ${type}] ${subject}`,
      html: htmlContent,
      replyTo: userEmail,
    });

    if (error) {
      console.error("Erro ao enviar email via Resend:", error);
      return { success: false, error: "Erro ao enviar sua mensagem. Tente novamente mais tarde." };
    }

    return { success: true };
  } catch (error) {
    console.error("Exceção no envio de suporte:", error);
    return { success: false, error: "Erro interno no servidor." };
  }
}
