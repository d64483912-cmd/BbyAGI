import React, { useState, useEffect } from 'react';
import {
  FREE_MODELS,
  getOpenRouterConfig,
  saveOpenRouterConfig,
  validateApiKey
} from '../services/openRouterService';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const Settings: React.FC<SettingsProps> = ({ isOpen, onClose }) => {
  const [apiKey, setApiKey] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>(FREE_MODELS[0].id);
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [validationMessage, setValidationMessage] = useState<string>('');
  const [validationStatus, setValidationStatus] = useState<'success' | 'error' | null>(null);

  useEffect(() => {
    if (isOpen) {
      const config = getOpenRouterConfig();
      if (config) {
        setApiKey(config.apiKey);
        setSelectedModel(config.model);
      }
    }
  }, [isOpen]);

  const handleValidateAndSave = async () => {
    if (!apiKey.trim()) {
      setValidationMessage('Please enter an API key');
      setValidationStatus('error');
      return;
    }

    setIsValidating(true);
    setValidationMessage('Validating API key...');
    setValidationStatus(null);

    try {
      const isValid = await validateApiKey(apiKey.trim(), selectedModel);

      if (isValid) {
        saveOpenRouterConfig(apiKey.trim(), selectedModel);
        setValidationMessage('API key validated and saved successfully!');
        setValidationStatus('success');
        
        // Close modal after 2 seconds
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        setValidationMessage('Invalid API key or model. Please check your credentials.');
        setValidationStatus('error');
      }
    } catch (error) {
      setValidationMessage(`Validation failed: ${(error as Error).message}`);
      setValidationStatus('error');
    } finally {
      setIsValidating(false);
    }
  };

  const handleGetApiKey = () => {
    window.open('https://openrouter.ai/keys', '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div 
        className="bg-gradient-to-br from-amber-100 via-orange-50 to-amber-100 rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden"
        style={{
          boxShadow: '0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.8), inset 0 -2px 8px rgba(0,0,0,0.2)',
          border: '3px solid #8b5a3c',
          borderTop: '3px solid #a67c52',
          borderLeft: '3px solid #a67c52'
        }}
      >
        {/* Header */}
        <div 
          className="bg-gradient-to-b from-amber-700 to-amber-800 px-6 py-5 border-b-4 border-amber-900"
          style={{
            boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.3)',
            textShadow: '0 2px 4px rgba(0,0,0,0.5)'
          }}
        >
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold text-amber-50 flex items-center gap-3">
              <span className="text-4xl">⚙️</span>
              Settings & Configuration
            </h2>
            <button
              onClick={onClose}
              className="text-amber-50 hover:text-white text-3xl font-bold transition-all transform hover:rotate-90 duration-300"
              style={{
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
              }}
              aria-label="Close settings"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          {/* API Key Section */}
          <div 
            className="bg-gradient-to-br from-amber-50 to-orange-100 rounded-xl p-6 shadow-lg"
            style={{
              boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.15), 0 4px 12px rgba(0,0,0,0.1)',
              border: '2px solid #d4a574',
              borderBottom: '3px solid #a67c52',
              borderRight: '3px solid #a67c52'
            }}
          >
            <label className="block text-lg font-bold text-amber-900 mb-3" style={{ textShadow: '1px 1px 2px rgba(255,255,255,0.8)' }}>
              🔑 OpenRouter API Key
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-or-v1-..."
              className="w-full px-4 py-3 rounded-lg border-3 border-amber-600 bg-white shadow-inner focus:outline-none focus:ring-4 focus:ring-amber-400 font-mono text-base"
              style={{
                boxShadow: 'inset 0 3px 8px rgba(0,0,0,0.2), inset 0 1px 2px rgba(0,0,0,0.3)',
                border: '3px solid #8b5a3c',
                borderTop: '3px solid #6d4429'
              }}
            />
            <button
              onClick={handleGetApiKey}
              className="mt-3 text-sm text-amber-700 hover:text-amber-900 font-semibold underline"
              style={{ textShadow: '0 1px 1px rgba(255,255,255,0.5)' }}
            >
              Don't have an API key? Get one free at OpenRouter →
            </button>
          </div>

          {/* Model Selection */}
          <div 
            className="bg-gradient-to-br from-amber-50 to-orange-100 rounded-xl p-6 shadow-lg"
            style={{
              boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.15), 0 4px 12px rgba(0,0,0,0.1)',
              border: '2px solid #d4a574',
              borderBottom: '3px solid #a67c52',
              borderRight: '3px solid #a67c52'
            }}
          >
            <label className="block text-lg font-bold text-amber-900 mb-3" style={{ textShadow: '1px 1px 2px rgba(255,255,255,0.8)' }}>
              🤖 AI Model Selection
            </label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border-3 border-amber-600 bg-white shadow-inner focus:outline-none focus:ring-4 focus:ring-amber-400 text-base cursor-pointer"
              style={{
                boxShadow: 'inset 0 3px 8px rgba(0,0,0,0.2), inset 0 1px 2px rgba(0,0,0,0.3)',
                border: '3px solid #8b5a3c',
                borderTop: '3px solid #6d4429'
              }}
            >
              {FREE_MODELS.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))}
            </select>
            <p className="mt-3 text-sm text-amber-800 italic">
              {FREE_MODELS.find(m => m.id === selectedModel)?.description}
            </p>
          </div>

          {/* Validation Message */}
          {validationMessage && (
            <div 
              className={`rounded-xl p-4 ${
                validationStatus === 'success' 
                  ? 'bg-gradient-to-br from-green-100 to-green-200 border-green-600' 
                  : validationStatus === 'error'
                  ? 'bg-gradient-to-br from-red-100 to-red-200 border-red-600'
                  : 'bg-gradient-to-br from-blue-100 to-blue-200 border-blue-600'
              }`}
              style={{
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1), 0 4px 8px rgba(0,0,0,0.1)',
                border: '2px solid',
                borderBottom: '3px solid'
              }}
            >
              <p className={`text-base font-semibold ${
                validationStatus === 'success' ? 'text-green-900' : 
                validationStatus === 'error' ? 'text-red-900' : 
                'text-blue-900'
              }`}>
                {validationStatus === 'success' && '✅ '}
                {validationStatus === 'error' && '❌ '}
                {validationMessage}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              onClick={handleValidateAndSave}
              disabled={isValidating}
              className={`flex-1 py-4 px-6 rounded-xl text-white font-bold text-lg transform transition-all duration-150 ${
                isValidating 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-b from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 active:scale-95'
              }`}
              style={{
                boxShadow: isValidating 
                  ? 'inset 0 2px 4px rgba(0,0,0,0.3)' 
                  : '0 6px 0 #15803d, 0 8px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.3)',
                textShadow: '0 2px 4px rgba(0,0,0,0.4)',
                border: '2px solid #166534',
                borderTop: '2px solid #22c55e'
              }}
            >
              {isValidating ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⏳</span>
                  Validating...
                </span>
              ) : (
                'Validate & Save'
              )}
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-4 px-6 rounded-xl text-white font-bold text-lg bg-gradient-to-b from-gray-500 to-gray-700 hover:from-gray-600 hover:to-gray-800 transform active:scale-95 transition-all duration-150"
              style={{
                boxShadow: '0 6px 0 #374151, 0 8px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.3)',
                textShadow: '0 2px 4px rgba(0,0,0,0.4)',
                border: '2px solid #4b5563',
                borderTop: '2px solid #9ca3af'
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
