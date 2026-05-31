import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg-default)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background Mesh */}
      <div className="mesh-bg" />

      {/* Main Container */}
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          padding: "2rem",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "white",
              boxShadow: "0 8px 32px rgba(39, 174, 96, 0.2)",
              marginBottom: 16,
              overflow: "hidden"
            }}
          >
            <Image src="/logo.png" alt="EditalRadar Logo" width={80} height={80} style={{ objectFit: "contain" }} />
          </div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.75rem",
              fontWeight: 800,
              color: "var(--text)",
              letterSpacing: "-0.02em",
            }}
          >
            EditalRadar
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", marginTop: 4 }}>
            Estude com foco e inteligência.
          </p>
        </div>

        {children}
      </div>
    </div>
  );
}
