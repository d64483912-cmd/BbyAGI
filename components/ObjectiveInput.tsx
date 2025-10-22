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
    <div className="card-beveled p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4" style={{ 
        color: '#f5e6d3',
        textShadow: '0 2px 4px rgba(0,0,0,0.5), 0 0 20px rgba(212,165,116,0.3)'
      }}>
        🎯 Set Agent Objective
      </h2>
      <input
        type="text"
        className="input-inset w-full mb-4"
        placeholder="e.g., 'Develop a marketing strategy for a new product'"
        value={objective}
        onChange={(e) => setObjective(e.target.value)}
        disabled={isDisabled}
        style={isDisabled ? { opacity: 0.6, cursor: 'not-allowed' } : {}}
      />
      <button
        onClick={startAgent}
        className="button-tactile w-full"
        disabled={objective.trim() === '' || isDisabled}
        style={(objective.trim() === '' || isDisabled) ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
      >
        {isLoading ? '⏳ Loading...' : '▶️ Start Agent'}
      </button>
    </div>
  );
};

export default ObjectiveInput;
