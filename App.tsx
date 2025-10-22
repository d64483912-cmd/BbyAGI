import React, { useState, useEffect, useCallback, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ITask, ITaskHistoryEntry, AgentStatus } from './types';
import {
  generateInitialTasks,
  executeTask,
  rePrioritizeAndGenerateTasks,
  getOpenRouterConfig
} from './services/openRouterService';
import ObjectiveInput from './components/ObjectiveInput';
import AgentControl from './components/AgentControl';
import TaskDisplay from './components/TaskDisplay';
import AgentOutput from './components/AgentOutput';
import ExecutionIntervalInput from './components/ExecutionIntervalInput';
import Settings from './components/Settings';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import './styles/mobile-first.css';

const BABYAGI_STATE_KEY = 'babyagi-pwa-state';

const App: React.FC = () => {
  const [objective, setObjective] = useState<string>('');
  const [currentTasks, setCurrentTasks] = useState<ITask[]>([]);
  const [completedTasks, setCompletedTasks] = useState<ITaskHistoryEntry[]>([]);
  const [agentStatus, setAgentStatus] = useState<AgentStatus>(AgentStatus.IDLE);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [agentOutput, setAgentOutput] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [executionInterval, setExecutionInterval] = useState<number>(5); // Default to 5 seconds
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  const isAgentRunningRef = useRef(false);
  const reportRef = useRef<HTMLDivElement>(null); // Ref for the content to be exported as PDF

  // Function to start the agent
  const startAgent = useCallback(async () => {
    if (objective.trim() === '') {
      setError('Please set an objective to start the agent.');
      return;
    }
    
    // Check if API is configured
    const config = getOpenRouterConfig();
    if (!config) {
      setError('Please configure your OpenRouter API key in Settings first.');
      setIsSettingsOpen(true);
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

  // New function to clear all pending tasks
  const clearAllTasks = useCallback(() => {
    if (currentTasks.length > 0 || completedTasks.length > 0) {
      setCurrentTasks([]);
      setCompletedTasks([]);
      setAgentStatus(AgentStatus.IDLE);
      setIsLoading(false);
      setError(null);
      isAgentRunningRef.current = false;
      setAgentOutput('All pending tasks cleared. Agent is idle.');
    }
  }, [currentTasks.length, completedTasks.length]);

  // New function to skip the current task
  const skipCurrentTask = useCallback(() => {
    if (currentTasks.length > 0 && !isLoading) {
      setCurrentTasks(prev => prev.slice(1));
      setIsLoading(false); // Reset isLoading, so useEffect can re-evaluate
      setAgentOutput('Current task skipped. Moving to the next task...');
      // If no more tasks, the useEffect will trigger reprioritization or completion.
      // If agent was paused, it remains paused but with a shorter queue.
      // If agent was running, the useEffect will naturally pick up the next task (or reprioritize)
    }
  }, [currentTasks, isLoading]);

  // Function to save the current agent state to localStorage
  const saveAgentState = useCallback(() => {
    try {
      const stateToSave = {
        objective,
        currentTasks,
        completedTasks,
        // When saving, set status to IDLE to prevent auto-resuming on load
        agentStatus: agentStatus === AgentStatus.RUNNING || agentStatus === AgentStatus.PAUSED ? AgentStatus.IDLE : agentStatus,
        executionInterval,
      };
      localStorage.setItem(BABYAGI_STATE_KEY, JSON.stringify(stateToSave));
      setAgentOutput('Agent state saved successfully!');
      setError(null);
    } catch (e: any) {
      setError(`Failed to save state: ${e.message}`);
      setAgentOutput('Failed to save agent state.');
      console.error('Error saving state:', e);
    }
  }, [objective, currentTasks, completedTasks, agentStatus, executionInterval]);

  // Function to load agent state from localStorage
  const loadAgentState = useCallback(() => {
    if (agentStatus === AgentStatus.RUNNING || agentStatus === AgentStatus.PAUSED) {
      setError('Cannot load state while agent is running or paused. Please reset first.');
      return;
    }
    try {
      const savedState = localStorage.getItem(BABYAGI_STATE_KEY);
      if (!savedState) {
        setAgentOutput('No saved state found.');
        setError(null);
        return;
      }

      const parsedState = JSON.parse(savedState);

      // Basic validation of loaded state structure
      if (
        typeof parsedState.objective !== 'string' ||
        !Array.isArray(parsedState.currentTasks) ||
        !Array.isArray(parsedState.completedTasks) ||
        !Object.values(AgentStatus).includes(parsedState.agentStatus) ||
        typeof parsedState.executionInterval !== 'number'
      ) {
        throw new Error('Invalid or corrupted saved state.');
      }

      setObjective(parsedState.objective);
      setCurrentTasks(parsedState.currentTasks);
      setCompletedTasks(parsedState.completedTasks);
      // Force status to IDLE on load for safety
      setAgentStatus(AgentStatus.IDLE);
      setExecutionInterval(parsedState.executionInterval);

      // Reset transient states
      setIsLoading(false);
      setError(null);
      isAgentRunningRef.current = false;
      setAgentOutput('Agent state loaded successfully! Click Start to resume.');
    } catch (e: any) {
      setError(`Failed to load state: ${e.message}`);
      setAgentOutput('Failed to load agent state.');
      console.error('Error loading state:', e);
    }
  }, [agentStatus]);

  // Function to generate PDF report
  const generatePdfReport = useCallback(async () => {
    if (!reportRef.current) {
      setError('Report content not found for PDF generation.');
      console.error('Report ref is null.');
      return;
    }
    setIsLoading(true);
    setAgentOutput('Generating PDF report...');
    setError(null);

    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2, // Increase scale for better resolution
        useCORS: true, // If any images are loaded from external sources
        windowWidth: reportRef.current.scrollWidth,
        windowHeight: reportRef.current.scrollHeight,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4'); // 'p' for portrait, 'mm' for units, 'a4' for page size
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const filename = `BabyAGI_Report_${new Date().toISOString().slice(0, 10)}.pdf`;
      pdf.save(filename);
      setAgentOutput(`PDF report "${filename}" generated successfully!`);
    } catch (e: any) {
      setError(`Failed to generate PDF report: ${e.message}`);
      setAgentOutput('Failed to generate PDF report.');
      console.error('Error generating PDF:', e);
    } finally {
      setIsLoading(false);
    }
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

    // Only schedule if agent is running and not currently busy loading/executing
    if (agentStatus === AgentStatus.RUNNING && !isLoading) {
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
  }, [agentStatus, isLoading, executionInterval, runAgentStep, currentTasks.length]); // Added currentTasks.length to re-trigger when tasks change

  // Effect to manage `isAgentRunningRef` when `agentStatus` changes from external events (e.g., pause button)
  useEffect(() => {
    isAgentRunningRef.current = agentStatus === AgentStatus.RUNNING;
  }, [agentStatus]);

  const hasPendingTasks = currentTasks.length > 0;
  const hasActiveObjectiveOrTasks = objective.trim() !== '' || currentTasks.length > 0 || completedTasks.length > 0;
  const isAgentBusy = isLoading; // Use isLoading to determine if agent is busy
  const canLoadState = !isAgentBusy && (agentStatus === AgentStatus.IDLE || agentStatus === AgentStatus.COMPLETE || agentStatus === AgentStatus.ERROR);
  const canSaveState = !isAgentBusy && hasActiveObjectiveOrTasks;
  const canExportReport = !isAgentBusy && (completedTasks.length > 0 || agentOutput.trim() !== '');


  return (
    <div className="app-container">
      {/* Header */}
      <div className="app-header">
        <div className="flex items-center justify-between mb-md">
          <h1 className="app-title">👶 BabyAGI II</h1>
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="btn btn-icon btn-secondary"
            aria-label="Open settings"
          >
            ⚙️
          </button>
        </div>
        <p className="app-subtitle">Autonomous AI Agent Framework</p>
        
        {/* Status Badge */}
        {agentStatus !== AgentStatus.IDLE && (
          <div className="flex items-center justify-center gap-sm mt-md">
            <span className={`status-dot ${agentStatus.toLowerCase()}`}></span>
            <span className="badge badge-primary">
              {agentStatus === AgentStatus.RUNNING && '🤖 Running'}
              {agentStatus === AgentStatus.PAUSED && '⏸️ Paused'}
              {agentStatus === AgentStatus.ERROR && '❌ Error'}
            </span>
          </div>
        )}
      </div>

      {/* Settings Modal */}
      <Settings isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

      {/* Error Alert */}
      {error && (
        <div className="alert alert-error" role="alert">
          <span>⚠️</span>
          <div>
            <p className="font-semibold">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Main Content - Mobile First Single Column */}
      <div className="space-y-4">
        {/* Objective Input Card */}
        <div className="card">
          <ObjectiveInput
            objective={objective}
            setObjective={setObjective}
            startAgent={startAgent}
            agentStatus={agentStatus}
            isLoading={isLoading}
          />
        </div>

        {/* Controls Card - Collapsible on Mobile */}
        {(agentStatus !== AgentStatus.IDLE || objective) && (
          <div className="card">
            <h3 className="text-lg font-semibold mb-md">Agent Controls</h3>
            
            {/* Primary Controls */}
            <div className="btn-group mb-md">
              {agentStatus === AgentStatus.IDLE && (
                <button
                  onClick={startAgent}
                  className="btn btn-success"
                  disabled={isLoading || !objective}
                >
                  ▶️ Start Agent
                </button>
              )}
              {agentStatus === AgentStatus.RUNNING && (
                <button
                  onClick={pauseAgent}
                  className="btn btn-warning"
                  disabled={isLoading}
                >
                  ⏸️ Pause
                </button>
              )}
              {agentStatus === AgentStatus.PAUSED && (
                <button
                  onClick={resumeAgent}
                  className="btn btn-success"
                  disabled={isLoading}
                >
                  ▶️ Resume
                </button>
              )}
              <button
                onClick={resetAgent}
                className="btn btn-error"
                disabled={isLoading && agentStatus === AgentStatus.RUNNING}
              >
                🔄 Reset
              </button>
            </div>

            {/* Execution Interval */}
            <ExecutionIntervalInput
              executionInterval={executionInterval}
              setExecutionInterval={setExecutionInterval}
              agentStatus={agentStatus}
              isLoading={isLoading}
            />

            {/* Task Actions */}
            <div className="btn-group mt-md">
              <button
                onClick={skipCurrentTask}
                className="btn btn-secondary"
                disabled={!hasPendingTasks || isAgentBusy}
              >
                ⏭️ Skip Task
              </button>
              <button
                onClick={clearAllTasks}
                className="btn btn-secondary"
                disabled={!hasActiveObjectiveOrTasks || isAgentBusy}
              >
                🗑️ Clear All
              </button>
            </div>

            {/* State Management */}
            <div className="btn-group mt-md">
              <button
                onClick={saveAgentState}
                className="btn btn-secondary"
                disabled={!canSaveState}
              >
                💾 Save State
              </button>
              <button
                onClick={loadAgentState}
                className="btn btn-secondary"
                disabled={!canLoadState}
              >
                📂 Load State
              </button>
            </div>

            {/* Export */}
            <button
              onClick={generatePdfReport}
              className="btn btn-secondary w-full mt-md"
              disabled={!canExportReport}
            >
              📊 Export PDF Report
            </button>
          </div>
        )}

        {/* Tasks Display - Main Content */}
        <div ref={reportRef}>
          {(currentTasks.length > 0 || completedTasks.length > 0) && (
            <div className="card">
              <TaskDisplay
                objective={objective}
                currentTask={currentTasks[0] || null}
                pendingTasks={currentTasks.slice(1)}
                isLoading={isLoading}
              />
            </div>
          )}

          {/* Agent Output */}
          {(agentOutput || completedTasks.length > 0) && (
            <div className="card">
              <AgentOutput
                agentOutput={agentOutput}
                taskHistory={completedTasks}
                isLoading={isLoading}
                error={error}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;