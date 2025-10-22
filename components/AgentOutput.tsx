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
    <div className="bg-gray-800 p-6 rounded-lg shadow-xl border-l-4 border-purple-500">
      <h2 className="text-xl font-semibold text-gray-100 mb-4">Agent Output</h2>

      {isLoading && (
        <div className="flex items-center text-blue-400 mb-4 font-bold text-lg">
          <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-400 mr-3"></span>
          Processing...
        </div>
      )}

      {error && (
        <div className="bg-red-950 text-red-100 p-3 rounded-md mb-4 border-l-4 border-red-500 shadow-md flex items-center">
          <span className="text-xl mr-2">⚠️</span>
          <div>
            <p className="font-semibold">Error:</p>
            <p>{error}</p>
          </div>
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-300 mb-2">Current Activity / Thoughts:</h3>
        <pre className="p-3 bg-gray-700 rounded-md text-gray-100 whitespace-pre-wrap font-mono text-sm border border-gray-600 min-h-[80px]">
          {agentOutput || "Waiting for agent activity..."}
        </pre>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-300 mb-2">Task History:</h3>
        <input
          type="text"
          className="w-full p-3 rounded-md bg-gray-700 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400 mb-4"
          placeholder="Filter task history by task or result..."
          value={historyFilter}
          onChange={(e) => setHistoryFilter(e.target.value)}
          aria-label="Filter task history by task or result"
        />
        {filteredTaskHistory.length > 0 ? (
          <div className="space-y-4">
            {filteredTaskHistory.slice().reverse().map((entry) => (
              <div key={entry.id} className="bg-gray-700 p-4 rounded-md border-l-4 border-purple-400 shadow-sm hover:bg-gray-700 transition-colors duration-150">
                <p className="text-gray-200 font-semibold mb-1">
                  Task: <span className="text-purple-300">{entry.taskDescription}</span>
                </p>
                <p className="text-gray-300 mb-1 text-sm">{entry.timestamp}</p>
                <p className="text-gray-400 text-sm whitespace-pre-wrap">{entry.result}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="p-3 bg-gray-700 rounded-md text-gray-400 border border-gray-600">
            {historyFilter ? "No matching tasks in history." : "No tasks completed yet."}
          </p>
        )}
      </div>
    </div>
  );
};

export default AgentOutput;