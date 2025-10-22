
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { ITask, ITaskHistoryEntry } from '../types';

// Utility to ensure API key is available
const getGeminiClient = () => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY is not set. Please set the API_KEY environment variable.");
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateInitialTasks = async (objective: string): Promise<ITask[]> => {
  const ai = getGeminiClient();
  const prompt = `You are an autonomous AI agent. Your objective is: "${objective}".
  Break down this objective into a list of 3-5 concise, actionable initial subtasks.
  Return the tasks as a JSON array of objects, each with an 'id' (a simple unique string) and 'description' field.
  Example: [{"id": "task1", "description": "Research X"}, {"id": "task2", "description": "Summarize Y"}]`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              description: { type: Type.STRING },
            },
            required: ['id', 'description'],
            propertyOrdering: ['id', 'description'],
          },
        },
      },
    });

    const jsonStr = response.text.trim();
    return JSON.parse(jsonStr) as ITask[];
  } catch (error) {
    console.error("Error generating initial tasks:", error);
    throw new Error("Failed to generate initial tasks.");
  }
};

export const executeTask = async (
  objective: string,
  task: ITask,
  context: ITaskHistoryEntry[],
): Promise<string> => {
  const ai = getGeminiClient();
  const contextString = context.map(entry => `Task: ${entry.taskDescription}\nResult: ${entry.result}`).join('\n---\n');

  const prompt = `You are an autonomous AI agent.
  Current Objective: "${objective}"
  Task to Execute: "${task.description}"
  Previous Tasks and Results:\n${contextString || "No previous tasks."}
  
  Simulate the execution of the "Task to Execute". Provide a concise, factual result or a brief summary of the action taken. Do not generate next tasks or future steps. Focus only on the result of THIS task.`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash', // Use flash for quicker execution summaries
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error(`Error executing task ${task.id} (${task.description}):`, error);
    throw new Error(`Failed to execute task: ${task.description}`);
  }
};

export const rePrioritizeAndGenerateTasks = async (
  objective: string,
  completedTasks: ITaskHistoryEntry[],
  currentTasks: ITask[], // Remaining tasks
): Promise<ITask[]> => {
  const ai = getGeminiClient();
  const completedTasksString = completedTasks.map(entry => `Task: ${entry.taskDescription}\nResult: ${entry.result}`).join('\n---\n');
  const currentTasksString = currentTasks.map(task => `Task ID: ${task.id}, Description: ${task.description}`).join('\n');

  const prompt = `You are an autonomous AI agent.
  Current Objective: "${objective}"
  Completed Tasks and Results:\n${completedTasksString || "No tasks completed yet."}
  Remaining/Current Tasks (not yet completed):\n${currentTasksString || "No remaining tasks."}

  Based on the objective, completed tasks, and remaining tasks, evaluate the situation.
  Generate an updated, prioritized list of 3-5 subtasks to efficiently achieve the objective.
  If the objective appears largely complete, generate an empty array.
  If you believe the objective is complete, indicate it by returning an empty array.
  Return the tasks as a JSON array of objects, each with an 'id' (a simple unique string) and 'description' field.
  Ensure IDs are unique, even if new tasks are similar to old ones.
  Example: [{"id": "task_new_1", "description": "Analyze market trends"}, {"id": "task_new_2", "description": "Draft report"}]`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              description: { type: Type.STRING },
            },
            required: ['id', 'description'],
            propertyOrdering: ['id', 'description'],
          },
        },
      },
    });

    const jsonStr = response.text.trim();
    const newTasks = JSON.parse(jsonStr) as ITask[];
    return newTasks;
  } catch (error) {
    console.error("Error re-prioritizing and generating tasks:", error);
    throw new Error("Failed to re-prioritize and generate tasks.");
  }
};
