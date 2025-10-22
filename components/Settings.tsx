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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h2 className="text-xl font-bold flex items-center gap-sm">
            <span>⚙️</span>
            Settings
          </h2>
          <button
            onClick={onClose}
            className="btn btn-icon btn-ghost"
            aria-label="Close settings"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="modal-body space-y-lg">
          {/* API Key Section */}
          <div>
            <label className="block text-sm font-semibold text-secondary mb-sm">
              🔑 OpenRouter API Key
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-or-v1-..."
              className="input font-mono"
            />
            <button
              onClick={handleGetApiKey}
              className="mt-sm text-xs text-primary hover:underline font-semibold"
            >
              Don't have an API key? Get one free at OpenRouter →
            </button>
          </div>

          {/* Model Selection */}
          <div>
            <label className="block text-sm font-semibold text-secondary mb-sm">
              🤖 AI Model Selection
            </label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="select"
            >
              {FREE_MODELS.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))}
            </select>
            <p className="mt-sm text-xs text-tertiary">
              {FREE_MODELS.find(m => m.id === selectedModel)?.description}
            </p>
          </div>

          {/* Validation Message */}
          {validationMessage && (
            <div 
              className={`alert ${
                validationStatus === 'success' 
                  ? 'alert-success' 
                  : validationStatus === 'error'
                  ? 'alert-error'
                  : 'alert-info'
              }`}
              role="alert"
            >
              <span>
                {validationStatus === 'success' && '✅'}
                {validationStatus === 'error' && '❌'}
                {!validationStatus && 'ℹ️'}
              </span>
              <p className="font-semibold">{validationMessage}</p>
            </div>
          )}
        </div>

        {/* Footer with Action Buttons */}
        <div className="modal-footer">
          <button
            onClick={onClose}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button
            onClick={handleValidateAndSave}
            disabled={isValidating}
            className="btn btn-primary"
          >
            {isValidating ? (
              <span className="flex items-center gap-sm">
                <div className="spinner spinner-sm"></div>
                Validating...
              </span>
            ) : (
              'Validate & Save'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
