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
    <div className="bg-gray-800 p-6 rounded-lg shadow-xl border-l-4 border-purple-500 mb-6">
      <h2 className="text-xl font-semibold text-gray-100 mb-4">Agent Status</h2>

      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-300 mb-2">Objective:</h3>
        <p className="p-3 bg-gray-700 rounded-md text-gray-100 border border-gray-600 min-h-[40px]">
          {objective || "No objective set."}
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-300 mb-2">Current Task:</h3>
        <p className={`p-3 rounded-md min-h-[40px] flex items-center
          ${isLoading && currentTask ? 'bg-blue-800 border-blue-600 text-blue-200 animate-pulse' : 'bg-blue-900 border-blue-700 text-blue-100'}`}>
          {isLoading && currentTask ? (
            <span className="flex items-center">
              <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-200 mr-2"></span>
              Executing task: {currentTask.description}
            </span>
          ) : isLoading && !currentTask ? (
            <span className="flex items-center">
              <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-200 mr-2"></span>
              Thinking...
            </span>
          ) : currentTask ? (
            currentTask.description
          ) : (
            "No task currently active."
          )}
        </p>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-300 mb-2">Pending Tasks:</h3>
        <input
          type="text"
          className="w-full p-3 rounded-md bg-gray-700 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400 mb-4"
          placeholder="Filter pending tasks..."
          value={pendingTaskFilter}
          onChange={(e) => setPendingTaskFilter(e.target.value)}
          aria-label="Filter pending tasks by description"
        />
        {filteredPendingTasks.length > 0 ? (
          <ul className="space-y-2">
            {filteredPendingTasks.map((task) => (
              <li key={task.id} className="p-3 bg-gray-700 rounded-md text-gray-100 border-l-4 border-purple-400 shadow-sm hover:bg-gray-700 transition-colors duration-150">
                {task.description}
              </li>
            ))}
          </ul>
        ) : (
          <p className="p-3 bg-gray-700 rounded-md text-gray-400 border border-gray-600">
            {pendingTaskFilter ? "No matching pending tasks." : "No pending tasks."}
          </p>
        )}
      </div>
    </div>
  );
};

export default TaskDisplay;