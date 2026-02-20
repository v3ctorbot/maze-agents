type Listener<T> = (data: T) => void;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
class MessageBus<EventMap extends Record<string, any>> {
  private listeners = new Map<keyof EventMap, Listener<unknown>[]>();

  on<K extends keyof EventMap>(event: K, listener: Listener<EventMap[K]>): void {
    const existing = this.listeners.get(event) ?? [];
    existing.push(listener as Listener<unknown>);
    this.listeners.set(event, existing);
  }

  off<K extends keyof EventMap>(event: K, listener: Listener<EventMap[K]>): void {
    const existing = this.listeners.get(event) ?? [];
    this.listeners.set(
      event,
      existing.filter((l) => l !== (listener as Listener<unknown>))
    );
  }

  emit<K extends keyof EventMap>(event: K, data: EventMap[K]): void {
    const existing = this.listeners.get(event) ?? [];
    for (const listener of existing) {
      listener(data);
    }
  }

  clear(): void {
    this.listeners.clear();
  }
}

export interface GameEvents {
  "agent:message": { agent: "v3ktor" | "claude"; message: string };
  "agent:status": {
    agent: "v3ktor" | "claude";
    status: "idle" | "thinking" | "communicating" | "moving" | "arrived";
  };
  "agent:position": {
    agent: "v3ktor" | "claude";
    x: number;
    y: number;
    z: number;
    rotation: number;
  };
  "game:won": Record<string, never>;
}

export const gameBus = new MessageBus<GameEvents>();
