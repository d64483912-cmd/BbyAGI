
import React from 'react';
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
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-semibold text-gray-100 mb-4">Agent Status</h2>

      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-300 mb-2">Objective:</h3>
        <p className="p-3 bg-gray-700 rounded-md text-gray-100 border border-gray-600 min-h-[40px]">
          {objective || "No objective set."}
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-300 mb-2">Current Task:</h3>
        <p className="p-3 bg-blue-900 rounded-md text-blue-100 border border-blue-700 min-h-[40px] flex items-center">
          {isLoading && !currentTask ? (
            <span className="flex items-center">
              <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-100 mr-2"></span>
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
        {pendingTasks.length > 0 ? (
          <ul className="space-y-2">
            {pendingTasks.map((task) => (
              <li key={task.id} className="p-3 bg-gray-700 rounded-md text-gray-100 border border-gray-600">
                {task.description}
              </li>
            ))}
          </ul>
        ) : (
          <p className="p-3 bg-gray-700 rounded-md text-gray-400 border border-gray-600">
            No pending tasks.
          </p>
        )}
      </div>
    </div>
  );
};

export default TaskDisplay;
