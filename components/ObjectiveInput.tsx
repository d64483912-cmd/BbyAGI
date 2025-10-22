
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
    <div className="bg-gray-800 p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-semibold text-gray-100 mb-4">Set Agent Objective</h2>
      <input
        type="text"
        className="w-full p-3 rounded-md bg-gray-700 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400 mb-4"
        placeholder="e.g., 'Develop a marketing strategy for a new product'"
        value={objective}
        onChange={(e) => setObjective(e.target.value)}
        disabled={isDisabled}
      />
      <button
        onClick={startAgent}
        className={`w-full py-3 px-6 rounded-md text-white font-semibold transition-colors duration-200 ${
          objective.trim() === '' || isDisabled
            ? 'bg-gray-600 cursor-not-allowed'
            : 'bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800'
        }`}
        disabled={objective.trim() === '' || isDisabled}
      >
        {isLoading ? 'Loading...' : 'Start Agent'}
      </button>
    </div>
  );
};

export default ObjectiveInput;
