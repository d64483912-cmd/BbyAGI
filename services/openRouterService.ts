import { ITask, ITaskHistoryEntry } from '../types';

// OpenRouter API configuration
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Free models available on OpenRouter - suitable for AI agent tasks
export const FREE_MODELS = [
  // Recommended models for complex tasks
  {
    id: 'meta-llama/llama-3.2-3b-instruct:free',
    name: 'Meta Llama 3.2 3B Instruct (Free)',
    description: '⭐ Recommended - Fast and efficient, excellent for agent tasks'
  },
  {
    id: 'google/gemma-2-9b-it:free',
    name: 'Google Gemma 2 9B IT (Free)',
    description: '⭐ Recommended - Strong reasoning, great for planning'
  },
  {
    id: 'mistralai/mistral-7b-instruct:free',
    name: 'Mistral 7B Instruct (Free)',
    description: '⭐ Recommended - Balanced performance for all tasks'
  },
  
  // High-performance models (may have rate limits)
  {
    id: 'nousresearch/hermes-3-llama-3.1-405b:free',
    name: 'Hermes 3 Llama 3.1 405B (Free)',
    description: '🚀 Most powerful - Best quality but limited availability'
  },
  {
    id: 'meta-llama/llama-3.1-70b-instruct:free',
    name: 'Meta Llama 3.1 70B Instruct (Free)',
    description: '🚀 Very powerful - Excellent for complex reasoning'
  },
  {
    id: 'meta-llama/llama-3.1-8b-instruct:free',
    name: 'Meta Llama 3.1 8B Instruct (Free)',
    description: 'Strong performance with good speed'
  },
  
  // Specialized models
  {
    id: 'microsoft/phi-3-mini-128k-instruct:free',
    name: 'Microsoft Phi-3 Mini 128K (Free)',
    description: '📚 Long context (128K) - Great for analyzing large texts'
  },
  {
    id: 'microsoft/phi-3-medium-128k-instruct:free',
    name: 'Microsoft Phi-3 Medium 128K (Free)',
    description: '📚 Long context (128K) - Better reasoning than mini'
  },
  {
    id: 'qwen/qwen-2-7b-instruct:free',
    name: 'Qwen 2 7B Instruct (Free)',
    description: 'Alibaba model - Strong in multilingual tasks'
  },
  {
    id: 'qwen/qwen-2.5-7b-instruct:free',
    name: 'Qwen 2.5 7B Instruct (Free)',
    description: 'Latest Qwen - Improved reasoning and coding'
  },
  
  // Lightweight models for quick tasks
  {
    id: 'meta-llama/llama-3.2-1b-instruct:free',
    name: 'Meta Llama 3.2 1B Instruct (Free)',
    description: '⚡ Ultra-fast - Best for simple, quick tasks'
  },
  {
    id: 'google/gemma-7b-it:free',
    name: 'Google Gemma 7B IT (Free)',
    description: 'Efficient Google model for general tasks'
  },
  
  // Additional capable models
  {
    id: 'liquid/lfm-40b:free',
    name: 'Liquid LFM 40B (Free)',
    description: 'Liquid AI model - Good for general reasoning'
  },
  {
    id: 'openchat/openchat-7b:free',
    name: 'OpenChat 7B (Free)',
    description: 'Fine-tuned for conversational tasks'
  },
  {
    id: 'mythomist/mythomist-7b:free',
    name: 'MythoMist 7B (Free)',
    description: 'Creative and analytical tasks'
  }
];

export interface OpenRouterConfig {
  apiKey: string;
  model: string;
  baseURL?: string;
}

// Get API configuration from localStorage
export const getOpenRouterConfig = (): OpenRouterConfig | null => {
  try {
    const apiKey = localStorage.getItem('openrouter_api_key');
    const model = localStorage.getItem('openrouter_model') || FREE_MODELS[0].id;
    
    if (!apiKey) {
      return null;
    }
    
    return {
      apiKey,
      model,
      baseURL: OPENROUTER_API_URL
    };
  } catch (error) {
    console.error('Error reading OpenRouter config:', error);
    return null;
  }
};

// Save API configuration to localStorage
export const saveOpenRouterConfig = (apiKey: string, model: string): void => {
  try {
    localStorage.setItem('openrouter_api_key', apiKey);
    localStorage.setItem('openrouter_model', model);
  } catch (error) {
    console.error('Error saving OpenRouter config:', error);
    throw new Error('Failed to save API configuration');
  }
};

// Validate API key by making a test request
export const validateApiKey = async (apiKey: string, model: string): Promise<boolean> => {
  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'BabyAGI II'
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'user',
            content: 'Hello'
          }
        ],
        max_tokens: 10
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('API validation failed:', errorData);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error validating API key:', error);
    return false;
  }
};

// Helper function to call OpenRouter API
const callOpenRouter = async (
  messages: Array<{ role: string; content: string }>,
  responseFormat?: 'json' | 'text'
): Promise<string> => {
  const config = getOpenRouterConfig();
  
  if (!config) {
    throw new Error('OpenRouter API is not configured. Please set your API key in Settings.');
  }

  try {
    const requestBody: any = {
      model: config.model,
      messages: messages,
      temperature: 0.7,
      max_tokens: 2000
    };

    // Add JSON response format if requested
    if (responseFormat === 'json') {
      requestBody.response_format = { type: 'json_object' };
    }

    const response = await fetch(config.baseURL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'BabyAGI II'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('OpenRouter API error:', errorData);
      
      if (response.status === 401) {
        throw new Error('Invalid API key. Please check your OpenRouter API key in Settings.');
      } else if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      } else if (response.status === 402) {
        throw new Error('Insufficient credits. Please check your OpenRouter account.');
      }
      
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.choices || data.choices.length === 0) {
      throw new Error('No response from API');
    }

    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling OpenRouter API:', error);
    throw error;
  }
};

// Generate initial tasks based on objective
export const generateInitialTasks = async (objective: string): Promise<ITask[]> => {
  const prompt = `You are an autonomous AI agent. Your objective is: "${objective}".

Break down this objective into a list of 3-5 concise, actionable initial subtasks.

You MUST respond with ONLY a valid JSON array, nothing else. Each object should have:
- "id": a unique task identifier (like "task1", "task2", etc.)
- "description": a clear description of the task

Example format:
[{"id": "task1", "description": "Research the topic"}, {"id": "task2", "description": "Summarize findings"}]

Respond with ONLY the JSON array, no explanations, no markdown, no code blocks.`;

  try {
    const messages = [
      {
        role: 'system',
        content: 'You are a task planning AI. Always respond with valid JSON arrays.'
      },
      {
        role: 'user',
        content: prompt
      }
    ];

    const responseText = await callOpenRouter(messages);
    
    // Try to extract JSON from response
    let jsonStr = responseText.trim();
    
    // Remove markdown code blocks if present
    jsonStr = jsonStr.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    
    // Try to find JSON array in the response
    const arrayMatch = jsonStr.match(/\[\s*{[\s\S]*}\s*\]/);
    if (arrayMatch) {
      jsonStr = arrayMatch[0];
    }
    
    // Try to find JSON object in the response
    const objectMatch = jsonStr.match(/{[\s\S]*}/);
    if (!arrayMatch && objectMatch) {
      jsonStr = objectMatch[0];
    }
    
    // Try to parse JSON
    let parsedData;
    try {
      parsedData = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Response text:', responseText);
      throw new Error('Failed to parse AI response as JSON. The model may not support JSON mode.');
    }
    
    // Handle different response formats
    let tasks: ITask[];
    
    if (Array.isArray(parsedData)) {
      // Direct array response
      tasks = parsedData;
    } else if (parsedData && typeof parsedData === 'object') {
      // Object wrapper - try common keys
      if (Array.isArray(parsedData.tasks)) {
        tasks = parsedData.tasks;
      } else if (Array.isArray(parsedData.subtasks)) {
        tasks = parsedData.subtasks;
      } else if (Array.isArray(parsedData.items)) {
        tasks = parsedData.items;
      } else {
        console.error('Unexpected response format:', parsedData);
        throw new Error('AI returned an object but no task array was found. Try a different model.');
      }
    } else {
      throw new Error('AI response is not in expected format.');
    }
    
    // Validate structure
    if (!Array.isArray(tasks)) {
      throw new Error('Task data is not an array.');
    }
    
    if (tasks.length === 0) {
      throw new Error('AI returned an empty task list. Please try rephrasing your objective.');
    }
    
    // Validate each task has required fields
    const validTasks = tasks.filter((task: any) => {
      return task && typeof task === 'object' && 
             (task.id || task.taskId) && 
             (task.description || task.task || task.name);
    });
    
    if (validTasks.length === 0) {
      console.error('No valid tasks found in:', tasks);
      throw new Error('AI returned tasks in wrong format. Expected objects with id and description.');
    }
    
    // Normalize task format
    const normalizedTasks: ITask[] = validTasks.map((task: any, index: number) => ({
      id: task.id || task.taskId || `task_${index + 1}`,
      description: task.description || task.task || task.name || 'Unnamed task'
    }));
    
    return normalizedTasks;
  } catch (error) {
    console.error('Error generating initial tasks:', error);
    throw new Error('Failed to generate initial tasks. ' + (error as Error).message);
  }
};

// Execute a specific task
export const executeTask = async (
  objective: string,
  task: ITask,
  context: ITaskHistoryEntry[]
): Promise<string> => {
  const contextString = context
    .map(entry => `Task: ${entry.taskDescription}\nResult: ${entry.result}`)
    .join('\n---\n');

  const prompt = `You are an autonomous AI agent.
Current Objective: "${objective}"
Task to Execute: "${task.description}"
Previous Tasks and Results:
${contextString || 'No previous tasks.'}

Simulate the execution of the "Task to Execute". Provide a concise, factual result or a brief summary of the action taken. Do not generate next tasks or future steps. Focus only on the result of THIS task.`;

  try {
    const messages = [
      {
        role: 'system',
        content: 'You are a task execution AI. Provide clear, concise results.'
      },
      {
        role: 'user',
        content: prompt
      }
    ];

    return await callOpenRouter(messages, 'text');
  } catch (error) {
    console.error(`Error executing task ${task.id} (${task.description}):`, error);
    throw new Error(`Failed to execute task: ${task.description}. ` + (error as Error).message);
  }
};

// Re-prioritize and generate new tasks
export const rePrioritizeAndGenerateTasks = async (
  objective: string,
  completedTasks: ITaskHistoryEntry[],
  currentTasks: ITask[]
): Promise<ITask[]> => {
  const completedTasksString = completedTasks
    .map(entry => `Task: ${entry.taskDescription}\nResult: ${entry.result}`)
    .join('\n---\n');
    
  const currentTasksString = currentTasks
    .map(task => `Task ID: ${task.id}, Description: ${task.description}`)
    .join('\n');

  const prompt = `You are an autonomous AI agent.
Current Objective: "${objective}"
Completed Tasks and Results:
${completedTasksString || 'No tasks completed yet.'}
Remaining/Current Tasks (not yet completed):
${currentTasksString || 'No remaining tasks.'}

Based on the objective, completed tasks, and remaining tasks, evaluate the situation.
Generate an updated, prioritized list of 3-5 subtasks to efficiently achieve the objective.
If the objective appears largely complete, generate an empty array.
If you believe the objective is complete, indicate it by returning an empty array.
Return the tasks as a JSON array of objects, each with an 'id' (a simple unique string) and 'description' field.
Ensure IDs are unique, even if new tasks are similar to old ones.
Example: [{"id": "task_new_1", "description": "Analyze market trends"}, {"id": "task_new_2", "description": "Draft report"}]

IMPORTANT: Respond with ONLY valid JSON, no other text.`;

  try {
    const messages = [
      {
        role: 'system',
        content: 'You are a task planning AI. Always respond with valid JSON arrays.'
      },
      {
        role: 'user',
        content: prompt
      }
    ];

    const responseText = await callOpenRouter(messages);
    
    // Try to extract JSON from response
    let jsonStr = responseText.trim();
    
    // Remove markdown code blocks if present
    jsonStr = jsonStr.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    
    // Try to find JSON array in the response
    const arrayMatch = jsonStr.match(/\[\s*{[\s\S]*}\s*\]/);
    if (arrayMatch) {
      jsonStr = arrayMatch[0];
    }
    
    // Try to find JSON object in the response
    const objectMatch = jsonStr.match(/{[\s\S]*}/);
    if (!arrayMatch && objectMatch) {
      jsonStr = objectMatch[0];
    }
    
    // Try to parse JSON
    let parsedData;
    try {
      parsedData = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Response text:', responseText);
      throw new Error('Failed to parse AI response as JSON. The model may not support JSON mode.');
    }
    
    // Handle different response formats
    let newTasks: ITask[];
    
    if (Array.isArray(parsedData)) {
      // Direct array response
      newTasks = parsedData;
    } else if (parsedData && typeof parsedData === 'object') {
      // Object wrapper - try common keys
      if (Array.isArray(parsedData.tasks)) {
        newTasks = parsedData.tasks;
      } else if (Array.isArray(parsedData.subtasks)) {
        newTasks = parsedData.subtasks;
      } else if (Array.isArray(parsedData.items)) {
        newTasks = parsedData.items;
      } else {
        console.error('Unexpected response format:', parsedData);
        throw new Error('AI returned an object but no task array was found. Try a different model.');
      }
    } else {
      throw new Error('AI response is not in expected format.');
    }
    
    // Validate structure (empty array is valid)
    if (!Array.isArray(newTasks)) {
      throw new Error('Task data is not an array.');
    }
    
    // Empty array is valid (means objective is complete)
    if (newTasks.length === 0) {
      return [];
    }
    
    // Validate each task has required fields
    const validTasks = newTasks.filter((task: any) => {
      return task && typeof task === 'object' && 
             (task.id || task.taskId) && 
             (task.description || task.task || task.name);
    });
    
    // Normalize task format
    const normalizedTasks: ITask[] = validTasks.map((task: any, index: number) => ({
      id: task.id || task.taskId || `task_new_${index + 1}`,
      description: task.description || task.task || task.name || 'Unnamed task'
    }));
    
    return normalizedTasks;
  } catch (error) {
    console.error('Error re-prioritizing and generating tasks:', error);
    throw new Error('Failed to re-prioritize and generate tasks. ' + (error as Error).message);
  }
};
