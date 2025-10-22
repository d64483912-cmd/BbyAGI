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
    <div className="mt-md">
      <label 
        htmlFor="execution-interval" 
        className="block text-sm font-semibold mb-sm text-secondary"
      >
        ⏱️ Task Execution Interval
      </label>
      <div className="flex items-center gap-md">
        <input
          id="execution-interval"
          type="number"
          min="0"
          max="60"
          className="input"
          value={executionInterval}
          onChange={handleChange}
          disabled={isDisabled}
          aria-label="Set task execution interval in seconds"
        />
        <span className="text-sm text-secondary whitespace-nowrap">seconds</span>
      </div>
      <p className="text-xs text-tertiary mt-sm">
        Time to wait between tasks (0 = instant execution)
      </p>
    </div>
  );
};

export default ExecutionIntervalInput;
