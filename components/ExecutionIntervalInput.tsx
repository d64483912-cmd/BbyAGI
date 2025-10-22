import React from 'react';
import { AgentStatus } from '../types';

interface ExecutionIntervalInputProps {
  executionInterval: number;
  setExecutionInterval: (interval: number) => void;
  agentStatus: AgentStatus;
  isLoading: boolean;
}

const ExecutionIntervalInput: React.FC<ExecutionIntervalInputProps> = ({
  executionInterval,
  setExecutionInterval,
  agentStatus,
  isLoading,
}) => {
  const isDisabled = isLoading || agentStatus === AgentStatus.RUNNING || agentStatus === AgentStatus.PAUSED;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 0) {
      setExecutionInterval(value);
    } else if (e.target.value === '') {
        setExecutionInterval(0); // Allow clearing the input to imply 0
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-xl border-l-4 border-purple-500 mb-6">
      <h2 className="text-xl font-semibold text-gray-100 mb-4">Task Execution Interval</h2>
      <label htmlFor="execution-interval" className="block text-gray-300 text-sm font-medium mb-2" aria-live="polite">
        Seconds between tasks (0 for instant progression):
      </label>
      <input
        id="execution-interval"
        type="number"
        min="0"
        className="w-full p-3 rounded-md bg-gray-700 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400"
        value={executionInterval}
        onChange={handleChange}
        disabled={isDisabled}
        aria-label="Set task execution interval in seconds"
      />
    </div>
  );
};

export default ExecutionIntervalInput;