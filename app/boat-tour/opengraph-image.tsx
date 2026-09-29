import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

/** Prévia do link quando alguém "manda no grupo" (WhatsApp, Instagram…). */
export const alt = "Uboatt · Entre a bordo antes de embarcar. Tour 360° da embarcação.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const logo = await readFile(join(process.cwd(), "public/brand/uboatt-logo-branco.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "linear-gradient(135deg, #062B55 0%, #0B3A6B 55%, #168BC5 100%)",
          color: "#FFFFFF",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse só aceita <img> */}
          <img src={logoSrc} alt="Uboatt" width={352} height={100} />
          <div
            style={{
              marginLeft: 16,
              padding: "8px 18px",
              borderRadius: 999,
              background: "rgba(36,169,224,0.25)",
              color: "#D9F0FA",
              fontSize: 24,
              fontWeight: 700,
              letterSpacing: 3,
            }}
          >
            EXPERIÊNCIA 360°
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 84, fontWeight: 800, lineHeight: 1.02, letterSpacing: -2, maxWidth: 900 }}>
            Entre a bordo antes de embarcar.
          </div>
          <div style={{ marginTop: 26, fontSize: 32, color: "rgba(255,255,255,0.82)" }}>
            Conheça a lancha em 360° e mande no grupo.
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 24, color: "rgba(255,255,255,0.7)" }}>
          <div>Salvador · Baía de Todos os Santos</div>
          <div style={{ color: "#24A9E0", fontWeight: 700 }}>Quem marca, embarca</div>
        </div>
      </div>
    ),
    size,
  );
}
