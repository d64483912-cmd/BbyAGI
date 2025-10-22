
export interface ITask {
  id: string;
  description: string;
}

export interface ITaskHistoryEntry {
  id: string;
  taskDescription: string;
  result: string;
  timestamp: string;
}

export enum AgentStatus {
  IDLE = 'idle',
  RUNNING = 'running',
  PAUSED = 'paused',
  COMPLETE = 'complete',
  ERROR = 'error',
}
