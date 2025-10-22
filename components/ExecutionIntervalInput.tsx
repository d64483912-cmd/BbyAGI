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
    <div className="card-beveled p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4" style={{ 
        color: '#f5e6d3',
        textShadow: '0 2px 4px rgba(0,0,0,0.5), 0 0 20px rgba(212,165,116,0.3)'
      }}>
        ⏱️ Task Execution Interval
      </h2>
      <label 
        htmlFor="execution-interval" 
        className="block text-base font-medium mb-3" 
        style={{ color: '#e8c9a0', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
        aria-live="polite"
      >
        Seconds between tasks (0 for instant):
      </label>
      <input
        id="execution-interval"
        type="number"
        min="0"
        className="input-inset w-full"
        value={executionInterval}
        onChange={handleChange}
        disabled={isDisabled}
        style={isDisabled ? { opacity: 0.6, cursor: 'not-allowed' } : {}}
        aria-label="Set task execution interval in seconds"
      />
    </div>
  );
};

export default ExecutionIntervalInput;
