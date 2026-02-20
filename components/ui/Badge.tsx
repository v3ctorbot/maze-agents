import type { AgentStatus } from "@/lib/store/gameStore";

const BADGE_CLASSES: Record<AgentStatus, string> = {
  idle: "badge badge-idle",
  thinking: "badge badge-thinking",
  communicating: "badge badge-communicating",
  moving: "badge badge-moving",
  arrived: "badge badge-arrived",
};

const STATUS_LABELS: Record<AgentStatus, string> = {
  idle: "Idle",
  thinking: "Thinking...",
  communicating: "Communicating",
  moving: "Moving",
  arrived: "Arrived!",
};

const STATUS_DOTS: Record<AgentStatus, string> = {
  idle: "bg-slate-400",
  thinking: "bg-yellow-400 animate-pulse",
  communicating: "bg-blue-400 animate-pulse",
  moving: "bg-green-400",
  arrived: "bg-cyan-400 animate-pulse",
};

interface Props {
  status: AgentStatus;
}

export default function Badge({ status }: Props) {
  return (
    <span className={BADGE_CLASSES[status]}>
      <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOTS[status]}`} />
      {STATUS_LABELS[status]}
    </span>
  );
}
