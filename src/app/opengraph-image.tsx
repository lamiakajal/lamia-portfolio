// ==========================================
// Share preview picture (1200x630) shown when the website link is shared on
// Facebook, LinkedIn, WhatsApp, X ... It is generated automatically.
// ==========================================

import { ImageResponse } from "next/og";

export const alt = "Lamia Kajal - Full Stack Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 90px",
          background: "linear-gradient(135deg, #12051f 0%, #2a0b3d 55%, #5b1450 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignSelf: "flex-start",
            padding: "10px 26px",
            borderRadius: 999,
            border: "2px solid rgba(244,114,182,0.6)",
            background: "rgba(236,72,153,0.15)",
            color: "#f9a8d4",
            fontSize: 28,
            fontWeight: 700,
          }}
        >
          Full Stack Developer
        </div>
        <div style={{ display: "flex", fontSize: 108, fontWeight: 800, marginTop: 34, lineHeight: 1.05 }}>
          Lamia Kajal
        </div>
        <div style={{ display: "flex", fontSize: 38, color: "#e9d5ff", marginTop: 26 }}>
          Next.js, TypeScript, React, Node.js and MongoDB
        </div>
        <div style={{ display: "flex", fontSize: 32, color: "#f472b6", marginTop: 54, fontWeight: 700 }}>
          lamiakajal.com
        </div>
      </div>
    ),
    size,
  );
}
