"use client";

import AgentMesh from "./AgentMesh";
import SpeechBubble from "./SpeechBubble";
import { CLAUDE_COLOR, CLAUDE_EMISSIVE, CLAUDE_ACCENT } from "@/lib/utils/constants";

interface Props {
  position: [number, number, number];
  rotation?: number;
  isMoving?: boolean;
  message: string | null;
  messageTimestamp: number;
}

export default function ClaudeAgent({
  position,
  rotation,
  isMoving,
  message,
  messageTimestamp,
}: Props) {
  return (
    <group position={position}>
      <AgentMesh
        primaryColor={CLAUDE_COLOR}
        emissiveColor={CLAUDE_EMISSIVE}
        accentColor={CLAUDE_ACCENT}
        position={[0, 0, 0]}
        rotation={rotation}
        isMoving={isMoving}
      />
      <SpeechBubble
        message={message}
        messageTimestamp={messageTimestamp}
        agentColor={CLAUDE_COLOR}
      />
    </group>
  );
}
