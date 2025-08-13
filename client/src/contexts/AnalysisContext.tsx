import { createContext, useState, useContext, type ReactNode } from 'react';
import type { AnalysisResult } from '../types';

interface AnalysisContextType {
  result: AnalysisResult | null;
  setResult: (result: AnalysisResult | null) => void;
  error: string | null;
  setError: (error: string | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  updateFileContent: (filePath: string, newContent: string) => void;
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

export const AnalysisProvider = ({ children }: { children: ReactNode }) => {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const updateFileContent = (filePath: string, newContent: string) => {
    setResult(prevResult => {
      if (!prevResult) return null;

      // Create new objects for immutable update
      const updatedFileContents = {
        ...prevResult.fileContents,
        [filePath]: newContent,
      };

      const updatedFileIssues = { ...prevResult.fileIssues };
      // After accepting, the issue is resolved, so we remove it
      delete updatedFileIssues[filePath];
      
      return {
        ...prevResult,
        fileContents: updatedFileContents,
        fileIssues: updatedFileIssues,
      };
    });
  };

  return (
    <AnalysisContext.Provider value={{ result, setResult, error, setError, isLoading, setIsLoading, updateFileContent }}>
      {children}
    </AnalysisContext.Provider>
  );
};

export const useAnalysis = () => {
  const context = useContext(AnalysisContext);
  if (!context) {
    throw new Error('useAnalysis must be used within an AnalysisProvider');
  }
  return context;
};