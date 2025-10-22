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
    <div className="bg-gray-800 p-6 rounded-lg shadow-xl border-l-4 border-purple-500 flex justify-around items-center mb-6">
      <button
        onClick={pauseAgent}
        className={`py-2 px-4 rounded-md text-white font-semibold transform hover:scale-105 active:scale-95 transition-all duration-150 ease-in-out ${
          isRunning && !isLoading
            ? 'bg-yellow-600 hover:bg-yellow-700'
            : 'bg-gray-600 cursor-not-allowed'
        } focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-gray-800`}
        disabled={!isRunning || isLoading}
      >
        Pause
      </button>
      <button
        onClick={resumeAgent}
        className={`py-2 px-4 rounded-md text-white font-semibold transform hover:scale-105 active:scale-95 transition-all duration-150 ease-in-out ${
          isPaused && !isLoading
            ? 'bg-green-600 hover:bg-green-700'
            : 'bg-gray-600 cursor-not-allowed'
        } focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-800`}
        disabled={!isPaused || isLoading}
      >
        Resume
      </button>
      <button
        onClick={resetAgent}
        className={`py-2 px-4 rounded-md text-white font-semibold transform hover:scale-105 active:scale-95 transition-all duration-150 ease-in-out ${
          (!isIdle || isLoading) // Enabled if not idle OR loading, meaning something is happening
            ? 'bg-red-600 hover:bg-red-700'
            : 'bg-gray-600 cursor-not-allowed'
        } focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800`}
        disabled={isIdle && !isLoading} // Disabled if idle AND not loading (nothing to reset)
      >
        Reset
      </button>
    </div>
  );
};

export default AgentControl;