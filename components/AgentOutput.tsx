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
    <div className="card-beveled p-6">
      <h2 className="text-2xl font-bold mb-6" style={{ 
        color: '#f5e6d3',
        textShadow: '0 2px 4px rgba(0,0,0,0.5), 0 0 20px rgba(212,165,116,0.3)'
      }}>
        💭 Agent Output
      </h2>

      {isLoading && (
        <div className="flex items-center mb-4 p-4 rounded-lg" style={{
          background: 'linear-gradient(145deg, #6b9bd1 0%, #4a7bb7 100%)',
          border: '3px solid #2d5580',
          boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.2), 0 4px 12px rgba(0,0,0,0.3)',
          color: '#e8f4ff',
          textShadow: '0 1px 2px rgba(0,0,0,0.5)',
          fontWeight: 'bold',
          fontSize: '1.1rem'
        }}>
          <span className="animate-spin rounded-full h-6 w-6 mr-3" style={{ 
            border: '4px solid transparent',
            borderTop: '4px solid #fff',
            borderRadius: '50%'
          }}></span>
          Processing...
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 rounded-lg flex items-start gap-3" style={{
          background: 'linear-gradient(145deg, #dc2626 0%, #991b1b 100%)',
          border: '3px solid #7f1d1d',
          boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.3), 0 4px 12px rgba(0,0,0,0.4)',
          color: '#fee2e2',
          textShadow: '0 1px 2px rgba(0,0,0,0.5)'
        }}>
          <span className="text-2xl">⚠️</span>
          <div className="flex-1">
            <p className="font-bold text-lg mb-1">Error:</p>
            <p>{error}</p>
          </div>
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3" style={{ color: '#e8c9a0', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
          💬 Current Activity:
        </h3>
        <div 
          className="container-paper p-4 rounded-lg font-mono text-sm min-h-[100px]"
          style={{ 
            border: '2px solid #d4a574',
            boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.1)',
            color: '#2d1810',
            whiteSpace: 'pre-wrap',
            lineHeight: '1.6'
          }}
        >
          {agentOutput || "Waiting for agent activity..."}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3" style={{ color: '#e8c9a0', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
          📚 Task History:
        </h3>
        <input
          type="text"
          className="input-inset w-full mb-4"
          placeholder="Filter task history by task or result..."
          value={historyFilter}
          onChange={(e) => setHistoryFilter(e.target.value)}
          aria-label="Filter task history by task or result"
        />
        {filteredTaskHistory.length > 0 ? (
          <div className="space-y-4 scrollbar-beveled" style={{ maxHeight: '500px', overflowY: 'auto', paddingRight: '8px' }}>
            {filteredTaskHistory.slice().reverse().map((entry, index) => (
              <div 
                key={entry.id} 
                className="p-4 rounded-lg transition-all duration-200"
                style={{
                  background: 'linear-gradient(145deg, #a8d5a8 0%, #7db87d 100%)',
                  border: '3px solid #5a9a5a',
                  borderLeft: '6px solid #3d7a3d',
                  boxShadow: '0 3px 10px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.3)',
                }}
              >
                <div className="flex items-start justify-between mb-2">
                  <p className="font-bold flex-1" style={{ 
                    color: '#1a4d1a',
                    textShadow: '0 1px 1px rgba(255,255,255,0.5)'
                  }}>
                    Task: <span style={{ color: '#2d661a' }}>{entry.taskDescription}</span>
                  </p>
                  <span className="badge-metallic ml-2" style={{ fontSize: '10px', padding: '3px 8px' }}>
                    ✓
                  </span>
                </div>
                <p className="text-xs mb-2" style={{ 
                  color: '#3d7a3d',
                  fontStyle: 'italic'
                }}>
                  🕒 {entry.timestamp}
                </p>
                <div 
                  className="container-paper p-3 rounded text-sm"
                  style={{
                    border: '1px solid #5a9a5a',
                    color: '#1a4d1a',
                    whiteSpace: 'pre-wrap',
                    lineHeight: '1.5'
                  }}
                >
                  {entry.result}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div 
            className="container-paper p-4 rounded-lg text-center"
            style={{ 
              border: '2px solid #d4a574',
              color: '#6d4429',
              fontStyle: 'italic'
            }}
          >
            {historyFilter ? "No matching tasks in history." : "No tasks completed yet."}
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentOutput;
