import React from 'react';
import { AgentStatus } from '../types';

interface AgentControlProps {
  agentStatus: AgentStatus;
  pauseAgent: () => void;
  resumeAgent: () => void;
  resetAgent: () => void;
  isLoading: boolean;
}

const AgentControl: React.FC<AgentControlProps> = ({
  agentStatus,
  pauseAgent,
  resumeAgent,
  resetAgent,
  isLoading,
}) => {
  const isRunning = agentStatus === AgentStatus.RUNNING;
  const isPaused = agentStatus === AgentStatus.PAUSED;
  const isIdle = agentStatus === AgentStatus.IDLE || agentStatus === AgentStatus.COMPLETE || agentStatus === AgentStatus.ERROR;

  return (
    <div className="btn-group">
      <button
        onClick={pauseAgent}
        className="btn btn-warning"
        disabled={!isRunning || isLoading}
      >
        ⏸️ Pause
      </button>
      <button
        onClick={resumeAgent}
        className="btn btn-success"
        disabled={!isPaused || isLoading}
      >
        ▶️ Resume
      </button>
      <button
        onClick={resetAgent}
        className="btn btn-secondary"
        disabled={isIdle && !isLoading}
      >
        🔄 Reset
      </button>
    </div>
  );
};

export default AgentControl;
