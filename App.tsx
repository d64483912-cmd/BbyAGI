
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ITask, ITaskHistoryEntry, AgentStatus } from './types';
import {
  generateInitialTasks,
  executeTask,
  rePrioritizeAndGenerateTasks,
} from './services/geminiService';
import ObjectiveInput from './components/ObjectiveInput';
import AgentControl from './components/AgentControl';
import TaskDisplay from './components/TaskDisplay';
import AgentOutput from './components/AgentOutput';
import ExecutionIntervalInput from './components/ExecutionIntervalInput'; // Import the new component

const App: React.FC = () => {
  const [objective, setObjective] = useState<string>('');
  const [currentTasks, setCurrentTasks] = useState<ITask[]>([]);
  const [completedTasks, setCompletedTasks] = useState<ITaskHistoryEntry[]>([]);
  const [agentStatus, setAgentStatus] = useState<AgentStatus>(AgentStatus.IDLE);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [agentOutput, setAgentOutput] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [executionInterval, setExecutionInterval] = useState<number>(5); // Default to 5 seconds

  const isAgentRunningRef = useRef(false);

  // Function to start the agent
  const startAgent = useCallback(async () => {
    if (objective.trim() === '') {
      setError('Please set an objective to start the agent.');
      return;
    }
    setError(null);
    setAgentStatus(AgentStatus.RUNNING);
    isAgentRunningRef.current = true;
    setIsLoading(true);
    setAgentOutput('Agent initialized. Generating initial tasks...');

    try {
      const initialTasks = await generateInitialTasks(objective);
      setCurrentTasks(initialTasks);
      setAgentOutput(`Initial tasks generated. Next task: "${initialTasks[0]?.description || 'None'}"`);
    } catch (e: any) {
      setError(`Failed to generate initial tasks: ${e.message}`);
      setAgentStatus(AgentStatus.ERROR);
      isAgentRunningRef.current = false;
    } finally {
      setIsLoading(false);
    }
  }, [objective]);

  // Function to pause the agent
  const pauseAgent = useCallback(() => {
    setAgentStatus(AgentStatus.PAUSED);
    isAgentRunningRef.current = false;
    setAgentOutput('Agent paused.');
  }, []);

  // Function to resume the agent
  const resumeAgent = useCallback(() => {
    setAgentStatus(AgentStatus.RUNNING);
    isAgentRunningRef.current = true;
    setAgentOutput('Agent resumed. Continuing operations...');
  }, []);

  // Function to reset the agent
  const resetAgent = useCallback(() => {
    setObjective('');
    setCurrentTasks([]);
    setCompletedTasks([]);
    setAgentStatus(AgentStatus.IDLE);
    setIsLoading(false);
    setAgentOutput('');
    setError(null);
    isAgentRunningRef.current = false;
  }, []);

  // The core BabyAGI logic, now *not* responsible for scheduling itself
  const runAgentStep = useCallback(async () => {
    // Check if agent is still meant to be running, this is crucial inside the async function
    if (!isAgentRunningRef.current || agentStatus !== AgentStatus.RUNNING) {
      return;
    }

    setIsLoading(true);
    setError(null);

    // Case 1: No current tasks, need to generate initial or re-prioritize
    if (currentTasks.length === 0) {
      setAgentOutput('No more pending tasks. Checking if objective is complete or new tasks are needed...');
      try {
        const newTasks = await rePrioritizeAndGenerateTasks(objective, completedTasks, []);
        if (newTasks.length === 0) {
          setAgentOutput('Objective appears complete! Agent is stopping.');
          setAgentStatus(AgentStatus.COMPLETE);
          isAgentRunningRef.current = false;
        } else {
          setCurrentTasks(newTasks); // This will trigger useEffect to schedule next task
          setAgentOutput(`New tasks generated. Next task: "${newTasks[0]?.description}"`);
        }
      } catch (e: any) {
        setError(`Failed to re-prioritize tasks: ${e.message}`);
        setAgentStatus(AgentStatus.ERROR);
        isAgentRunningRef.current = false;
      } finally {
        setIsLoading(false);
      }
      return; // Stop here, useEffect will react to state changes and potentially schedule the next step
    }

    // Case 2: Execute a task
    const nextTask = currentTasks[0];
    setAgentOutput(`Executing task: "${nextTask.description}"`);
    try {
      const result = await executeTask(objective, nextTask, completedTasks);
      setAgentOutput(`Task "${nextTask.description}" executed. Result: "${result}"`);

      const newCompletedTaskEntry = {
        id: uuidv4(), // Use uuid for history entry ID
        taskDescription: nextTask.description,
        result: result,
        timestamp: new Date().toLocaleString(),
      };

      // Update completed tasks state immediately
      setCompletedTasks((prev) => [...prev, newCompletedTaskEntry]);

      const remainingTasksAfterExecution = currentTasks.slice(1);

      // Re-prioritize based on new results
      setAgentOutput('Re-prioritizing tasks based on new results...');
      const updatedTasks = await rePrioritizeAndGenerateTasks(
        objective,
        [...completedTasks, newCompletedTaskEntry], // Pass current completed tasks (from closure) + the new one
        remainingTasksAfterExecution
      );
      setCurrentTasks(updatedTasks); // This will trigger useEffect to schedule next task

      if (updatedTasks.length === 0) {
        setAgentOutput('Objective appears complete! Agent is stopping.');
        setAgentStatus(AgentStatus.COMPLETE);
        isAgentRunningRef.current = false;
      } else {
        setAgentOutput(`Tasks updated. Next task: "${updatedTasks[0]?.description}"`);
      }
    } catch (e: any) {
      setError(`Agent operation failed: ${e.message}`);
      setAgentStatus(AgentStatus.ERROR);
      isAgentRunningRef.current = false;
    } finally {
      setIsLoading(false);
    }
  }, [objective, currentTasks, completedTasks, agentStatus]); // Dependencies for runAgentStep

  // Effect to schedule the next step based on agent state and interval
  useEffect(() => {
    let loopTimeout: number | undefined;

    if (agentStatus === AgentStatus.RUNNING && !isLoading) {
      // Determine the delay for the next step
      const delay = executionInterval > 0 ? executionInterval * 1000 : 50; // 50ms for instant progression (UI update)
      const nextTaskDescription = currentTasks[0]?.description || 'No specific task yet';

      setAgentOutput(`Agent running. Next task ("${nextTaskDescription}") in ${executionInterval} seconds...`);
      if (executionInterval === 0) {
        setAgentOutput(`Agent running. Executing next task ("${nextTaskDescription}") instantly.`);
      }

      loopTimeout = window.setTimeout(() => {
        // Double-check status before running to ensure it wasn't paused/reset during the delay
        if (isAgentRunningRef.current && agentStatus === AgentStatus.RUNNING) {
          runAgentStep();
        }
      }, delay);
    }

    return () => {
      if (loopTimeout !== undefined) {
        clearTimeout(loopTimeout);
      }
    };
  }, [agentStatus, currentTasks.length, completedTasks.length, isLoading, executionInterval, runAgentStep]);

  // Effect to manage `isAgentRunningRef` when `agentStatus` changes from external events (e.g., pause button)
  useEffect(() => {
    isAgentRunningRef.current = agentStatus === AgentStatus.RUNNING;
  }, [agentStatus]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6 font-sans">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-purple-400 mb-10 drop-shadow-lg">
          BabyAGI PWA Simulation 🤖
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <ObjectiveInput
              objective={objective}
              setObjective={setObjective}
              startAgent={startAgent}
              agentStatus={agentStatus}
              isLoading={isLoading}
            />
            <ExecutionIntervalInput // New component for interval control
              executionInterval={executionInterval}
              setExecutionInterval={setExecutionInterval}
              agentStatus={agentStatus}
              isLoading={isLoading}
            />
            <AgentControl
              agentStatus={agentStatus}
              pauseAgent={pauseAgent}
              resumeAgent={resumeAgent}
              resetAgent={resetAgent}
              isLoading={isLoading}
            />
          </div>
          <div className="lg:col-span-2">
            <TaskDisplay
              objective={objective}
              currentTask={currentTasks[0] || null}
              pendingTasks={currentTasks.slice(1)}
              isLoading={isLoading}
            />
          </div>
          <div className="lg:col-span-3">
            <AgentOutput
              agentOutput={agentOutput}
              taskHistory={completedTasks}
              isLoading={isLoading}
              error={error}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
