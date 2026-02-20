"use client";

import AgentMesh from "./AgentMesh";
import SpeechBubble from "./SpeechBubble";
import { V3KTOR_COLOR, V3KTOR_EMISSIVE, V3KTOR_ACCENT } from "@/lib/utils/constants";

interface Props {
  position: [number, number, number];
  rotation?: number;
  isMoving?: boolean;
  message: string | null;
  messageTimestamp: number;
}

export default function V3ktorAgent({
  position,
  rotation,
  isMoving,
  message,
  messageTimestamp,
}: Props) {
  return (
    <group position={position}>
      <AgentMesh
        primaryColor={V3KTOR_COLOR}
        emissiveColor={V3KTOR_EMISSIVE}
        accentColor={V3KTOR_ACCENT}
        position={[0, 0, 0]}
        rotation={rotation}
        isMoving={isMoving}
      />
      <SpeechBubble
        message={message}
        messageTimestamp={messageTimestamp}
        agentColor={V3KTOR_COLOR}
      />
    </group>
  );
}
