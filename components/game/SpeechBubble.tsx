"use client";

import { Html } from "@react-three/drei";

const TTL = 5000;

interface Props {
  message: string | null;
  messageTimestamp: number;
  agentColor: string;
}

export default function SpeechBubble({ message, messageTimestamp, agentColor }: Props) {
  const isVisible = message !== null && Date.now() - messageTimestamp < TTL;
  if (!isVisible) return null;

  return (
    <Html position={[0, 2.4, 0]} center distanceFactor={12} zIndexRange={[100, 0]}>
      <div
        style={{
          background: "rgba(15, 23, 42, 0.92)",
          border: `1px solid ${agentColor}40`,
          borderRadius: 8,
          padding: "5px 10px",
          fontSize: 11,
          color: "#e2e8f0",
          whiteSpace: "nowrap",
          maxWidth: 200,
          backdropFilter: "blur(4px)",
          boxShadow: `0 0 12px ${agentColor}30`,
          pointerEvents: "none",
        }}
      >
        <span
          style={{
            display: "inline-block",
            width: 6,
            height: 6,
            borderRadius: "50%",
            backgroundColor: agentColor,
            marginRight: 5,
            verticalAlign: "middle",
            boxShadow: `0 0 4px ${agentColor}`,
          }}
        />
        {message}
      </div>
    </Html>
  );
}
