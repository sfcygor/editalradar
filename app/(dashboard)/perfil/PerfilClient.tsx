"use client";

import { useState, useRef } from "react";
import { User, Camera, Mail, Lock, Download, RefreshCw, Trash2, Eye, EyeOff, CheckCircle2, LogOut, LifeBuoy } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { updateProfileInfoAction, changePasswordAction, resetProgressAction, deleteAccountAction, updateAvatarAction } from "@/lib/actions/profile";
import { logoutAction } from "@/lib/actions/auth";
import { useRouter } from "next/navigation";

export default function PerfilClient({ user }: { user: { name: string; email: string; avatarUrl?: string | null; plan?: string | null; billingCycle?: string | null; subscriptionDate?: Date | null; renewalDate?: Date | null; subscriptionStatus?: string | null; stripePriceId?: string | null; } }) {
  const [showPassword, setShowPassword] = useState(false);
  const [saved, setSaved] = useState(false);
  const [passSaved, setPassSaved] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isLoadingStripe, setIsLoadingStripe] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleUpgrade = async () => {
    setIsLoadingStripe(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID || "price_dummy" })
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else alert(data.error || "Erro ao iniciar checkout");
    } catch (e) {
      alert("Erro ao iniciar checkout");
    } finally {
      setIsLoadingStripe(false);
    }
  };

  const handleManage = async () => {
    setIsLoadingStripe(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else alert(data.error || "Erro ao acessar portal");
    } catch (e) {
      alert("Erro ao acessar portal");
    } finally {
      setIsLoadingStripe(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Por favor, selecione uma imagem.");
      return;
    }

    setIsUploading(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = async () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 400;
        const scaleSize = MAX_WIDTH / img.width;
        
        let width = img.width;
        let height = img.height;

        if (scaleSize < 1) {
          width = MAX_WIDTH;
          height = img.height * scaleSize;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);

        const base64String = canvas.toDataURL("image/jpeg", 0.7); // compress to JPEG 70% quality
        await updateAvatarAction(base64String);
        setIsUploading(false);
      };
      img.onerror = () => {
        alert("Erro ao processar a imagem.");
        setIsUploading(false);
      };
      img.src = event.target?.result as string;
    };
    reader.onerror = () => {
      alert("Erro ao ler a imagem.");
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveInfo = async (formData: FormData) => {
    await updateProfileInfoAction(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleSavePass = async (formData: FormData) => {
    const res = await changePasswordAction(formData);
    if (res.success) {
      setPassSaved(true);
      setTimeout(() => setPassSaved(false), 3000);
    } else {
      alert(res.error);
    }
  };

  const handleReset = async () => {
    setIsResetting(true);
    await resetProgressAction();
    setIsResetting(false);
    setIsResetModalOpen(false);
    alert("Progresso zerado com sucesso.");
  };

  const initials = user.name ? user.name.slice(0, 2).toUpperCase() : "US";

  return (
    <div className="page-container animate-fade-in">
      <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 24, alignItems: "start" }}>
        
        {/* Left: Avatar */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Card style={{ textAlign: "center", padding: 32 }}>
            <div style={{ position: "relative", display: "inline-block", marginBottom: 20 }}>
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  style={{
                    width: 96,
                    height: 96,
                    borderRadius: "50%",
                    objectFit: "cover",
                    margin: "0 auto",
                    border: "4px solid rgba(39,174,96,0.2)",
                    boxShadow: "0 8px 24px rgba(39,174,96,0.2)",
                    opacity: isUploading ? 0.5 : 1,
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 96,
                    height: 96,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, var(--primary), var(--primary-light))",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-display)",
                    fontWeight: 800,
                    fontSize: "2rem",
                    color: "white",
                    margin: "0 auto",
                    border: "4px solid rgba(39,174,96,0.2)",
                    boxShadow: "0 8px 24px rgba(39,174,96,0.2)",
                    opacity: isUploading ? 0.5 : 1,
                  }}
                >
                  {initials}
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleAvatarUpload}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                style={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: "var(--primary)",
                  border: "2px solid white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: isUploading ? "wait" : "pointer",
                  color: "white",
                }}
              >
                <Camera size={14} />
              </button>
            </div>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.125rem", marginBottom: 4 }}>
              {user.name}
            </h2>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: 16 }}>{user.email}</p>
          </Card>
          
          <Button 
            variant="secondary" 
            onClick={() => logoutAction()} 
            style={{ width: "100%", display: "flex", justifyContent: "center", gap: 8, color: "var(--danger)", borderColor: "var(--danger)" }}
          >
            <LogOut size={16} />
            Sair da Conta
          </Button>
        </div>

        {/* Right: Settings */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

          {/* Subscription Info */}
          {user.subscriptionStatus === "trialing" ? (
            <Card style={{ border: "1px solid var(--primary)", boxShadow: "0 8px 24px rgba(39,174,96,0.1)" }}>
              <CardHeader>
                <CardTitle style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--primary-dark)" }}>
                  <span>🎁</span> Teste Gratuito Ativo
                </CardTitle>
              </CardHeader>
              <div style={{ padding: "0 24px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
                <p style={{ fontSize: "0.875rem", color: "var(--text)" }}>
                  Você está utilizando o <strong>Plano {user.plan === 'avancado' ? 'Premium' : 'Padrão'}</strong> gratuitamente.
                </p>
                {(() => {
                  const daysLeft = user.renewalDate ? Math.ceil((new Date(user.renewalDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : 0;
                  return (
                    <div style={{ fontSize: "0.875rem", color: "var(--text)" }}>
                      Restam <strong>{daysLeft} {daysLeft === 1 ? 'dia' : 'dias'}</strong> para o fim do período de teste.
                    </div>
                  );
                })()}
                
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 8, background: "rgba(39,174,96,0.05)", padding: 16, borderRadius: 12 }}>
                  <div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: 2 }}>Primeira cobrança</div>
                    <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text)" }}>
                      {user.renewalDate ? new Date(user.renewalDate).toLocaleDateString('pt-BR') : "N/A"}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: 2 }}>Valor após o teste</div>
                    <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text)" }}>
                      R$ {user.stripePriceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_AVANCADO ? "69,90" : "39,90"}/mês
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
                  <Button 
                    variant="primary" 
                    style={{ width: "100%" }}
                    onClick={handleManage}
                    disabled={isLoadingStripe}
                  >
                    {isLoadingStripe ? "Aguarde..." : "Gerenciar Assinatura"}
                  </Button>
                  <Button 
                    variant="secondary" 
                    style={{ width: "100%", color: "var(--text-muted)", borderColor: "var(--border)" }}
                    onClick={handleManage}
                    disabled={isLoadingStripe}
                  >
                    Cancelar Assinatura
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <Card style={{ 
              border: user.plan === "avancado" ? "1px solid var(--primary)" : "1px solid var(--border)", 
              boxShadow: user.plan === "avancado" ? "0 8px 24px rgba(39,174,96,0.15)" : undefined,
              position: "relative",
              overflow: "hidden"
            }}>
              {user.plan === "avancado" && (
                <div style={{ position: "absolute", top: 0, right: 0, padding: "4px 16px", background: "linear-gradient(135deg, var(--primary), var(--primary-light))", color: "white", fontSize: "0.75rem", fontWeight: 700, borderBottomLeftRadius: 16 }}>
                  Plano Premium
                </div>
              )}
              <CardHeader>
                <CardTitle>Sua Assinatura</CardTitle>
              </CardHeader>
              <div style={{ padding: "0 24px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: 4 }}>Plano Atual</div>
                    <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--text)", textTransform: "capitalize" }}>
                      {user.plan || "Gratuito"}
                    </div>
                  </div>
                  <Badge variant={user.plan === "gratuito" ? "gray" : "green"} style={user.plan !== "gratuito" ? { background: "var(--primary)" } : {}}>
                    {user.plan === "gratuito" ? "Grátis" : "Ativo"}
                  </Badge>
                </div>

                {user.plan !== "gratuito" && (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 8, background: "rgba(0,0,0,0.02)", padding: 16, borderRadius: 12 }}>
                    <div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: 2 }}>Ciclo de Cobrança</div>
                      <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text)", textTransform: "capitalize" }}>{user.billingCycle || "Mensal"}</div>
                    </div>
                    {user.renewalDate && (
                      <div>
                        <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: 2 }}>Próxima Renovação</div>
                        <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text)" }}>{new Date(user.renewalDate).toLocaleDateString('pt-BR')}</div>
                      </div>
                    )}
                  </div>
                )}

                {user.plan === "gratuito" ? (
                  <a href="/home#pricing" style={{ display: "block", width: "100%", textDecoration: "none" }}>
                    <Button 
                      type="button"
                      variant="primary" 
                      style={{ width: "100%", marginTop: 8 }}
                      disabled={isLoadingStripe}
                    >
                      Fazer Upgrade
                    </Button>
                  </a>
                ) : (
                  <Button 
                    variant="secondary" 
                    style={{ width: "100%", marginTop: 8 }}
                    onClick={handleManage}
                    disabled={isLoadingStripe}
                  >
                    {isLoadingStripe ? "Aguarde..." : "Gerenciar Assinatura"}
                  </Button>
                )}
              </div>
            </Card>
          )}
          
          {/* Personal Info */}
          <Card>
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
            </CardHeader>
            <form action={handleSaveInfo}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <Input label="Nome" name="name" defaultValue={user.name} required />
                <Input label="Email" name="email" type="email" defaultValue={user.email} leftIcon={<Mail size={15} />} required />
              </div>
              <div style={{ marginTop: 16 }}>
                {saved ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--primary)", fontSize: "0.875rem", fontWeight: 600 }}>
                    <CheckCircle2 size={16} />
                    Salvo com sucesso!
                  </div>
                ) : (
                  <Button variant="primary" type="submit">Salvar Alterações</Button>
                )}
              </div>
            </form>
          </Card>

          {/* Change Password */}
          <Card>
            <CardHeader>
              <CardTitle>Alterar Senha</CardTitle>
            </CardHeader>
            <form action={handleSavePass}>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <Input label="Senha Atual" name="currentPassword" type={showPassword ? "text" : "password"} required
                  leftIcon={<Lock size={15} />}
                  rightIcon={
                    <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-subtle)" }}>
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  }
                />
                <Input label="Nova Senha" name="newPassword" type="password" leftIcon={<Lock size={15} />} hint="Mínimo 8 caracteres" required />
                <Input label="Confirmar Nova Senha" name="confirmPassword" type="password" leftIcon={<Lock size={15} />} required />
                
                {passSaved ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--primary)", fontSize: "0.875rem", fontWeight: 600 }}>
                    <CheckCircle2 size={16} /> Senha alterada!
                  </div>
                ) : (
                  <Button variant="secondary" type="submit">Alterar Senha</Button>
                )}
              </div>
            </form>
          </Card>

          {/* Support */}
          <Card style={{ border: "1px solid rgba(39,174,96,0.2)", background: "rgba(39,174,96,0.02)" }}>
            <CardHeader>
              <CardTitle style={{ color: "var(--primary-dark)", display: "flex", alignItems: "center", gap: 8 }}>
                <LifeBuoy size={18} /> Central de Ajuda
              </CardTitle>
            </CardHeader>
            <div style={{ padding: "0 24px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
              <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
                Encontrou algum problema ou tem sugestões para melhorar o EditalRadar? Fale conosco diretamente.
              </p>
              <Button 
                variant="primary" 
                onClick={() => window.location.href = "/suporte?from=" + encodeURIComponent(window.location.pathname)}
              >
                Reportar Problema
              </Button>
            </div>
          </Card>

          {/* Danger Zone */}
          <Card style={{ border: "1px solid rgba(239,68,68,0.2)", background: "rgba(239,68,68,0.02)" }}>
            <CardHeader>
              <CardTitle style={{ color: "var(--danger)" }}>Zona de Perigo</CardTitle>
            </CardHeader>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              
              <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
                <RefreshCw size={18} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--text)", marginBottom: 2 }}>Reiniciar Progresso</div>
                  <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", lineHeight: 1.5 }}>Apaga todo o histórico de questões, flashcards e revisões. Irreversível.</p>
                </div>
                <Button variant="secondary" size="sm" onClick={() => setIsResetModalOpen(true)} disabled={isResetting}>
                  {isResetting ? "Zerando..." : "Zerar Estatísticas"}
                </Button>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
                <Trash2 size={18} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--text)", marginBottom: 2 }}>Excluir Conta</div>
                  <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", lineHeight: 1.5 }}>Exclui permanentemente sua conta e todos os dados.</p>
                </div>
                <Button variant="danger" size="sm" onClick={() => setIsDeleteModalOpen(true)}>Excluir Conta</Button>
              </div>
              
            </div>
          </Card>
        </div>
      </div>

      <Modal isOpen={isResetModalOpen} onClose={() => setIsResetModalOpen(false)} title="Zerar Estatísticas">
        <p style={{ marginBottom: 20, color: "var(--text)", lineHeight: 1.6 }}>
          Tem certeza que deseja zerar todas as suas estatísticas? Todo o seu histórico de acertos, erros, sequências e revisões será perdido <strong>permanentemente</strong>.
        </p>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
          <Button variant="secondary" onClick={() => setIsResetModalOpen(false)}>Cancelar</Button>
          <Button variant="danger" onClick={handleReset} disabled={isResetting}>
            {isResetting ? "Zerando..." : "Sim, quero zerar tudo"}
          </Button>
        </div>
      </Modal>

      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Excluir Conta">
        <p style={{ marginBottom: 20, color: "var(--text)", lineHeight: 1.6 }}>
          A exclusão da conta é uma ação <strong>irreversível</strong>. Todos os seus dados, metas, questões criadas e histórico serão apagados dos nossos servidores. Tem certeza que deseja prosseguir?
        </p>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
          <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)}>Cancelar</Button>
          <form action={async () => { await deleteAccountAction(); }}>
            <Button variant="danger" type="submit">Excluir Conta Definitivamente</Button>
          </form>
        </div>
      </Modal>
    </div>
  );
}
