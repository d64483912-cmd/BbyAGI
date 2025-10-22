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
    <div className="card-beveled p-6 flex justify-around items-center mb-6 gap-4">
      <button
        onClick={pauseAgent}
        className="flex-1 button-tactile"
        disabled={!isRunning || isLoading}
        style={(!isRunning || isLoading) ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
      >
        ⏸️ Pause
      </button>
      <button
        onClick={resumeAgent}
        className="flex-1 button-tactile"
        disabled={!isPaused || isLoading}
        style={(!isPaused || isLoading) ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
      >
        ▶️ Resume
      </button>
      <button
        onClick={resetAgent}
        className="flex-1 button-tactile"
        disabled={isIdle && !isLoading}
        style={(isIdle && !isLoading) ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
      >
        🔄 Reset
      </button>
    </div>
  );
};

export default AgentControl;
