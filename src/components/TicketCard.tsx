import { toPng } from "html-to-image";

export interface TicketData {
  nome: string;
  acompanhantes: number;
  nomes_acompanhantes?: string | null;
}

// Downloads the ticket as a PNG file
export async function downloadTicket(element: HTMLElement, nome: string) {
  try {
    const dataUrl = await toPng(element, {
      cacheBust: true,
      pixelRatio: 2, // High resolution
      backgroundColor: "#fdf9f4",
    });
    const link = document.createElement("a");
    link.download = `ingresso-casamento-${nome.toLowerCase().replace(/\s+/g, "-")}.png`;
    link.href = dataUrl;
    link.click();
  } catch (err) {
    console.error("Erro ao gerar ingresso:", err);
  }
}

// The visual ticket card component
export function TicketCard({ data }: { data: TicketData }) {
  const companions = data.nomes_acompanhantes
    ? data.nomes_acompanhantes.split(",").map((n) => n.trim()).filter(Boolean)
    : [];
  const totalPessoas = 1 + (data.acompanhantes || 0);

  return (
    <div
      style={{
        width: "560px",
        background: "linear-gradient(145deg, #fdf9f4 0%, #fef6ea 50%, #fdf9f4 100%)",
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        color: "#2a1f14",
        padding: "0",
        borderRadius: "20px",
        overflow: "hidden",
        border: "1px solid #e8d9b8",
        boxShadow: "0 8px 40px rgba(180, 140, 80, 0.15)",
        position: "relative",
      }}
    >
      {/* Top gold stripe */}
      <div style={{
        background: "linear-gradient(90deg, #c9a84c, #e8d48a, #c9a84c)",
        height: "6px",
        width: "100%",
      }} />

      {/* Main content */}
      <div style={{ padding: "40px 48px 36px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <p style={{
            fontSize: "11px",
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            color: "#b8922a",
            fontFamily: "'Inter', sans-serif",
            fontWeight: 500,
            marginBottom: "10px",
          }}>
            Ingresso de Casamento
          </p>
          <h1 style={{
            fontSize: "52px",
            fontWeight: 400,
            lineHeight: 1,
            marginBottom: "6px",
            color: "#1e160c",
          }}>
            Raquel <span style={{ fontSize: "28px", fontStyle: "italic", color: "#b8922a" }}>&</span> Daniel
          </h1>
          <p style={{
            fontSize: "13px",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#7a6040",
            fontFamily: "'Inter', sans-serif",
            fontWeight: 300,
          }}>
            20 de Junho de 2026 · Catanduva
          </p>
        </div>

        {/* Divider with ornament */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "28px" }}>
          <div style={{ flex: 1, height: "1px", background: "linear-gradient(to right, transparent, #c9a84c)" }} />
          <span style={{ color: "#c9a84c", fontSize: "18px" }}>✦</span>
          <div style={{ flex: 1, height: "1px", background: "linear-gradient(to left, transparent, #c9a84c)" }} />
        </div>

        {/* Guest Info */}
        <div style={{ marginBottom: "24px" }}>
          <p style={{
            fontSize: "10px",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "#b8922a",
            fontFamily: "'Inter', sans-serif",
            fontWeight: 500,
            marginBottom: "6px",
          }}>
            Convidado
          </p>
          <p style={{
            fontSize: "32px",
            fontWeight: 500,
            lineHeight: 1.1,
            color: "#1e160c",
          }}>
            {data.nome}
          </p>
        </div>

        {/* Event Details Row */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "16px",
          marginBottom: companions.length > 0 ? "24px" : "28px",
        }}>
          {[
            { label: "Data", value: "20 · 06 · 2026" },
            { label: "Horário", value: "11h30" },
            { label: "Local", value: "Yellow Door Pub" },
          ].map((item) => (
            <div key={item.label} style={{
              background: "rgba(200, 165, 80, 0.08)",
              borderRadius: "10px",
              padding: "12px 14px",
              border: "1px solid rgba(200, 165, 80, 0.2)",
            }}>
              <p style={{
                fontSize: "9px",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: "#b8922a",
                fontFamily: "'Inter', sans-serif",
                fontWeight: 500,
                marginBottom: "4px",
              }}>
                {item.label}
              </p>
              <p style={{
                fontSize: "13px",
                fontWeight: 500,
                color: "#1e160c",
                lineHeight: 1.2,
              }}>
                {item.value}
              </p>
            </div>
          ))}
        </div>

        {/* Companions */}
        {companions.length > 0 && (
          <div style={{
            background: "rgba(200, 165, 80, 0.06)",
            borderRadius: "12px",
            padding: "16px 18px",
            marginBottom: "24px",
            border: "1px solid rgba(200, 165, 80, 0.18)",
          }}>
            <p style={{
              fontSize: "9px",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "#b8922a",
              fontFamily: "'Inter', sans-serif",
              fontWeight: 500,
              marginBottom: "10px",
            }}>
              Acompanhantes ({companions.length})
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {companions.map((name, idx) => (
                <div key={idx} style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "15px",
                  color: "#2a1f14",
                }}>
                  <span style={{ color: "#c9a84c", fontSize: "8px" }}>◆</span>
                  {name}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Total guests badge */}
        <div style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "28px",
        }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            background: "linear-gradient(135deg, #c9a84c, #e8d48a)",
            borderRadius: "20px",
            padding: "6px 14px",
          }}>
            <span style={{
              fontSize: "11px",
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
              color: "#1e160c",
            }}>
              {totalPessoas} {totalPessoas === 1 ? "pessoa" : "pessoas"}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
          <div style={{ flex: 1, height: "1px", background: "linear-gradient(to right, transparent, #c9a84c)" }} />
          <span style={{ color: "#c9a84c", fontSize: "18px" }}>✦</span>
          <div style={{ flex: 1, height: "1px", background: "linear-gradient(to left, transparent, #c9a84c)" }} />
        </div>

        {/* Footer message */}
        <div style={{ textAlign: "center" }}>
          <p style={{
            fontSize: "15px",
            fontStyle: "italic",
            color: "#6b4f2a",
            lineHeight: 1.6,
            marginBottom: "8px",
          }}>
            Que alegria enorme ter você com a gente nesse dia!
          </p>
          <p style={{
            fontSize: "11px",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "#b8922a",
            fontFamily: "'Inter', sans-serif",
            fontWeight: 400,
          }}>
            Guarde este ingresso · 20 · 06 · 2026
          </p>
        </div>
      </div>

      {/* Bottom gold stripe */}
      <div style={{
        background: "linear-gradient(90deg, #c9a84c, #e8d48a, #c9a84c)",
        height: "6px",
        width: "100%",
      }} />
    </div>
  );
}
