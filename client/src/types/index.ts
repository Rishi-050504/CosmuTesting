 export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AnalysisResult {
  checklist: ComplianceItem[];
  fileIssues: Record<string, FileIssue>;
  fileContents: Record<string, string>;
}

export interface ComplianceItem {
  id: number;
  text: string;
  compliant: boolean;
}

export interface FileIssue {
    issue?: string; 
  language: string;
  original: string;
  suggestion: string;
}
