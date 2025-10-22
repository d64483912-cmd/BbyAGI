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
    <>
      <h2 className="text-xl font-bold mb-md flex items-center gap-sm">
        📋 Task Status
        {(currentTask || pendingTasks.length > 0) && (
          <span className="badge badge-primary">
            {pendingTasks.length + (currentTask ? 1 : 0)} tasks
          </span>
        )}
      </h2>

      {/* Objective */}
      <div className="mb-lg">
        <h3 className="text-sm font-semibold text-secondary mb-sm">🎯 Objective</h3>
        <div className="task-item">
          <p>{objective || "No objective set."}</p>
        </div>
      </div>

      {/* Current Task */}
      {(currentTask || isLoading) && (
        <div className="mb-lg">
          <h3 className="text-sm font-semibold text-secondary mb-sm">⚡ Current Task</h3>
          <div className="task-item" style={{ 
            borderColor: isLoading ? 'var(--primary)' : 'var(--border)',
            backgroundColor: isLoading ? 'rgba(99, 102, 241, 0.05)' : 'var(--bg-primary)'
          }}>
            {isLoading && (
              <div className="flex items-center gap-md mb-sm">
                <div className="spinner spinner-sm"></div>
                <span className="text-sm font-semibold text-primary">
                  {currentTask ? 'Executing...' : 'Thinking...'}
                </span>
              </div>
            )}
            <p>{currentTask ? currentTask.description : 'Initializing next task...'}</p>
          </div>
        </div>
      )}

      {/* Pending Tasks */}
      {pendingTasks.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-sm">
            <h3 className="text-sm font-semibold text-secondary">
              📝 Pending Tasks ({filteredPendingTasks.length})
            </h3>
          </div>
          
          {pendingTasks.length > 3 && (
            <input
              type="text"
              className="input mb-md"
              placeholder="Search tasks..."
              value={pendingTaskFilter}
              onChange={(e) => setPendingTaskFilter(e.target.value)}
              aria-label="Filter pending tasks"
            />
          )}
          
          {filteredPendingTasks.length > 0 ? (
            <div className="task-list" style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {filteredPendingTasks.map((task, index) => (
                <div key={task.id} className="task-item">
                  <div className="flex items-start gap-md">
                    <span className="badge badge-primary flex-shrink-0">
                      #{index + 1}
                    </span>
                    <p className="flex-1">{task.description}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-secondary py-lg">
              <p>No matching tasks found</p>
            </div>
          )}
        </div>
      )}

      {!currentTask && pendingTasks.length === 0 && !isLoading && (
        <div className="text-center text-secondary py-xl">
          <p className="text-lg">✨ No tasks yet</p>
          <p className="text-sm mt-sm">Set an objective and start the agent to begin</p>
        </div>
      )}
    </>
  );
};

export default TaskDisplay;
