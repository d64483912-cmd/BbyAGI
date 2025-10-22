import React, { useState } from 'react';
import { ITaskHistoryEntry } from '../types';

interface AgentOutputProps {
  agentOutput: string;
  taskHistory: ITaskHistoryEntry[];
  isLoading: boolean;
  error: string | null;
}

const AgentOutput: React.FC<AgentOutputProps> = ({
  agentOutput,
  taskHistory,
  isLoading,
  error,
}) => {
  const [historyFilter, setHistoryFilter] = useState<string>('');

  const filteredTaskHistory = taskHistory.filter(entry =>
    entry.taskDescription.toLowerCase().includes(historyFilter.toLowerCase()) ||
    entry.result.toLowerCase().includes(historyFilter.toLowerCase())
  );

  return (
    <>
      <div className="flex items-center justify-between mb-md">
        <h2 className="text-xl font-bold">💭 Agent Output</h2>
        {taskHistory.length > 0 && (
          <span className="badge badge-success">
            {taskHistory.length} completed
          </span>
        )}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="alert alert-info mb-md">
          <div className="spinner spinner-sm"></div>
          <span className="font-semibold">Processing task...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="alert alert-error mb-md" role="alert">
          <span>⚠️</span>
          <div>
            <p className="font-semibold">Error occurred</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Current Activity */}
      <div className="mb-lg">
        <h3 className="text-sm font-semibold text-secondary mb-sm">💬 Current Activity</h3>
        <div className="code-block" style={{ minHeight: '100px' }}>
          <pre className="text-sm">
            <code>{agentOutput || "Waiting for agent activity..."}</code>
          </pre>
        </div>
      </div>

      {/* Task History */}
      <div>
        <h3 className="text-sm font-semibold text-secondary mb-sm">📚 Task History</h3>
        
        {taskHistory.length > 3 && (
          <input
            type="text"
            className="input mb-md"
            placeholder="Search history..."
            value={historyFilter}
            onChange={(e) => setHistoryFilter(e.target.value)}
            aria-label="Filter task history"
          />
        )}

        {filteredTaskHistory.length > 0 ? (
          <div className="space-y-md" style={{ maxHeight: '500px', overflowY: 'auto' }}>
            {filteredTaskHistory.slice().reverse().map((entry) => (
              <div key={entry.id} className="history-item">
                <div className="flex items-start justify-between gap-md mb-sm">
                  <p className="font-semibold flex-1">{entry.taskDescription}</p>
                  <span className="badge badge-success flex-shrink-0">✓</span>
                </div>
                <p className="text-xs text-tertiary mb-sm">🕒 {entry.timestamp}</p>
                <div className="code-block">
                  <pre className="text-sm">
                    <code>{entry.result}</code>
                  </pre>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-secondary py-xl">
            <p>
              {historyFilter ? "No matching tasks found" : "No tasks completed yet"}
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default AgentOutput;
