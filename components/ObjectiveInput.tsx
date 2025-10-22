import React from 'react';
import { AgentStatus } from '../types';

interface ObjectiveInputProps {
  objective: string;
  setObjective: (objective: string) => void;
  startAgent: () => void;
  agentStatus: AgentStatus;
  isLoading: boolean;
}

const ObjectiveInput: React.FC<ObjectiveInputProps> = ({
  objective,
  setObjective,
  startAgent,
  agentStatus,
  isLoading,
}) => {
  const isDisabled = isLoading || agentStatus === AgentStatus.RUNNING || agentStatus === AgentStatus.PAUSED;

  return (
    <>
      <h2 className="text-xl font-bold mb-md">
        🎯 Set Your Objective
      </h2>
      <textarea
        className="textarea mb-md"
        placeholder="e.g., 'Develop a marketing strategy for a new product launch'"
        value={objective}
        onChange={(e) => setObjective(e.target.value)}
        disabled={isDisabled}
        rows={3}
      />
      <p className="text-sm text-secondary mb-md">
        Describe what you want the AI agent to accomplish. The agent will break down your objective into tasks and execute them autonomously.
      </p>
      {agentStatus === AgentStatus.IDLE && (
        <button
          onClick={startAgent}
          className="btn btn-primary w-full"
          disabled={objective.trim() === '' || isDisabled}
        >
          {isLoading ? '🔄 Initializing...' : '▶️ Start Agent'}
        </button>
      )}
    </>
  );
};

export default ObjectiveInput;
