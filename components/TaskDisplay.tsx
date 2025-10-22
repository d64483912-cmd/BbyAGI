import React, { useState } from 'react';
import { ITask } from '../types';

interface TaskDisplayProps {
  objective: string;
  currentTask: ITask | null;
  pendingTasks: ITask[];
  isLoading: boolean;
}

const TaskDisplay: React.FC<TaskDisplayProps> = ({
  objective,
  currentTask,
  pendingTasks,
  isLoading,
}) => {
  const [pendingTaskFilter, setPendingTaskFilter] = useState<string>('');

  const filteredPendingTasks = pendingTasks.filter(task =>
    task.description.toLowerCase().includes(pendingTaskFilter.toLowerCase())
  );

  return (
    <div className="card-beveled p-6 mb-6">
      <h2 className="text-2xl font-bold mb-6" style={{ 
        color: '#f5e6d3',
        textShadow: '0 2px 4px rgba(0,0,0,0.5), 0 0 20px rgba(212,165,116,0.3)'
      }}>
        📋 Agent Status
      </h2>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3" style={{ color: '#e8c9a0', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
          🎯 Objective:
        </h3>
        <div 
          className="container-paper p-4 rounded-lg min-h-[60px] flex items-center"
          style={{ 
            border: '2px solid #d4a574',
            boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.1)',
            color: '#2d1810'
          }}
        >
          {objective || "No objective set."}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3" style={{ color: '#e8c9a0', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
          ⚡ Current Task:
        </h3>
        <div 
          className={`p-4 rounded-lg min-h-[60px] flex items-center ${
            isLoading && currentTask ? 'animate-pulse' : ''
          }`}
          style={{
            background: isLoading && currentTask 
              ? 'linear-gradient(145deg, #6b9bd1 0%, #4a7bb7 100%)'
              : 'linear-gradient(145deg, #5a8fc7 0%, #3d6fa3 100%)',
            border: '3px solid #2d5580',
            borderTop: '3px solid #6b9bd1',
            borderRadius: '12px',
            boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.2), 0 4px 12px rgba(0,0,0,0.3)',
            color: '#e8f4ff',
            textShadow: '0 1px 2px rgba(0,0,0,0.5)'
          }}
        >
          {isLoading && currentTask ? (
            <span className="flex items-center">
              <span className="animate-spin rounded-full h-5 w-5 border-b-3 border-white mr-3" style={{ 
                borderWidth: '3px',
                borderColor: '#fff transparent transparent transparent'
              }}></span>
              Executing task: {currentTask.description}
            </span>
          ) : isLoading && !currentTask ? (
            <span className="flex items-center">
              <span className="animate-spin rounded-full h-5 w-5 border-b-3 border-white mr-3" style={{ 
                borderWidth: '3px',
                borderColor: '#fff transparent transparent transparent'
              }}></span>
              Thinking...
            </span>
          ) : currentTask ? (
            currentTask.description
          ) : (
            "No task currently active."
          )}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3" style={{ color: '#e8c9a0', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
          📝 Pending Tasks:
        </h3>
        <input
          type="text"
          className="input-inset w-full mb-4"
          placeholder="Filter pending tasks..."
          value={pendingTaskFilter}
          onChange={(e) => setPendingTaskFilter(e.target.value)}
          aria-label="Filter pending tasks by description"
        />
        {filteredPendingTasks.length > 0 ? (
          <ul className="space-y-3 scrollbar-beveled" style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '8px' }}>
            {filteredPendingTasks.map((task, index) => (
              <li 
                key={task.id} 
                className="p-4 rounded-lg transition-all duration-200 hover:scale-102"
                style={{
                  background: 'linear-gradient(145deg, #e8c9a0 0%, #d4a574 100%)',
                  border: '2px solid #a67c52',
                  borderLeft: '5px solid #8b5a3c',
                  boxShadow: '0 3px 8px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.3)',
                  color: '#2d1810',
                  textShadow: '0 1px 1px rgba(255,255,255,0.5)',
                  fontWeight: 500
                }}
              >
                <span className="badge-metallic mr-2" style={{ fontSize: '11px', padding: '4px 8px' }}>
                  #{index + 1}
                </span>
                {task.description}
              </li>
            ))}
          </ul>
        ) : (
          <div 
            className="container-paper p-4 rounded-lg text-center"
            style={{ 
              border: '2px solid #d4a574',
              color: '#6d4429',
              fontStyle: 'italic'
            }}
          >
            {pendingTaskFilter ? "No matching pending tasks." : "No pending tasks."}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskDisplay;
