// Types for AI Forensic Investigator Trainer

export interface FileNode {
  name: string;
  type: 'file' | 'directory';
  content?: string;
  children?: FileNode[];
  metadata?: Record<string, string>;
}

export interface Evidence {
  id: string;
  path: string;
  name: string;
  type: 'email' | 'log' | 'file' | 'image' | 'registry' | 'network';
  description: string;
  isFound: boolean;
}

export interface CaseObjective {
  id: string;
  description: string;
  isCompleted: boolean;
  xpReward: number;
}

export interface Case {
  id: string;
  title: string;
  description: string;
  requestor: string;
  date: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  category: 'Malware Analysis' | 'Network Forensics' | 'Memory Forensics' | 'Log Analysis' | 'Incident Response';
  timeLimit: number; // in minutes
  xpReward: number;
  briefing: string;
  objectives: CaseObjective[];
  evidence: Evidence[];
  fileSystem: FileNode;
  solution: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface UserProgress {
  xp: number;
  level: number;
  completedCases: string[];
  badges: Badge[];
  hintsUsed: Record<string, number>;
  totalEvidenceFound: number;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  earnedAt?: Date;
}

export interface TerminalCommand {
  command: string;
  output: string;
  timestamp: Date;
}

export interface GameState {
  currentCase: Case | null;
  userProgress: UserProgress;
  isPlaying: boolean;
  startTime: number | null;
  chatHistory: ChatMessage[];
  terminalHistory: TerminalCommand[];
  currentPath: string;
  foundEvidence: string[];
}
