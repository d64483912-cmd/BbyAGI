import { useState, useEffect, useCallback } from 'react';

const DRAFT_STORAGE_KEY = 'babyagi-draft-objective';
const AUTO_SAVE_DELAY = 500; // milliseconds

interface UseDraftObjectiveReturn {
  draft: string;
  saveDraft: (text: string) => void;
  loadDraft: () => string;
  clearDraft: () => void;
  hasDraft: boolean;
}

/**
 * Hook for managing draft objective with auto-save to localStorage
 * Automatically saves draft after 500ms of no typing (debounced)
 * Loads draft on mount if exists
 */
export const useDraftObjective = (): UseDraftObjectiveReturn => {
  const [draft, setDraft] = useState<string>('');
  const [hasDraft, setHasDraft] = useState<boolean>(false);
  const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null);

  // Load draft on mount
  useEffect(() => {
    const savedDraft = loadDraft();
    if (savedDraft) {
      setDraft(savedDraft);
      setHasDraft(true);
    }
  }, []);

  // Load draft from localStorage
  const loadDraft = useCallback((): string => {
    try {
      const saved = localStorage.getItem(DRAFT_STORAGE_KEY);
      return saved || '';
    } catch (error) {
      console.error('Failed to load draft objective:', error);
      return '';
    }
  }, []);

  // Save draft to localStorage (debounced)
  const saveDraft = useCallback((text: string) => {
    setDraft(text);

    // Clear existing timeout
    if (saveTimeout) {
      clearTimeout(saveTimeout);
    }

    // If text is empty, clear the draft immediately
    if (!text || text.trim() === '') {
      try {
        localStorage.removeItem(DRAFT_STORAGE_KEY);
        setHasDraft(false);
      } catch (error) {
        console.error('Failed to clear draft objective:', error);
      }
      return;
    }

    // Set new timeout for auto-save
    const timeout = setTimeout(() => {
      try {
        localStorage.setItem(DRAFT_STORAGE_KEY, text);
        setHasDraft(true);
      } catch (error) {
        console.error('Failed to save draft objective:', error);
      }
    }, AUTO_SAVE_DELAY);

    setSaveTimeout(timeout);
  }, [saveTimeout]);

  // Clear draft from localStorage
  const clearDraft = useCallback(() => {
    try {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
      setDraft('');
      setHasDraft(false);
      
      // Clear any pending save timeout
      if (saveTimeout) {
        clearTimeout(saveTimeout);
        setSaveTimeout(null);
      }
    } catch (error) {
      console.error('Failed to clear draft objective:', error);
    }
  }, [saveTimeout]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeout) {
        clearTimeout(saveTimeout);
      }
    };
  }, [saveTimeout]);

  return {
    draft,
    saveDraft,
    loadDraft,
    clearDraft,
    hasDraft,
  };
};
