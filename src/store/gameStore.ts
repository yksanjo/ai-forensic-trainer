import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { GameState, Case, ChatMessage, UserProgress, Badge, TerminalCommand } from '../types';

const LEVEL_THRESHOLDS = [0, 1000, 5000, 15000, 50000];
const LEVEL_NAMES = [
  'Novice Investigator',
  'Junior Analyst',
  'Digital Forensics Specialist',
  'Senior Investigator',
  'Expert Forensics Consultant'
];

function calculateLevel(xp: number): number {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i]) {
      return i + 1;
    }
  }
  return 1;
}

function getLevelName(level: number): string {
  return LEVEL_NAMES[Math.min(level - 1, LEVEL_NAMES.length - 1)];
}

interface GameStore extends GameState {
  // Actions
  startCase: (caseData: Case) => void;
  endCase: (completed: boolean) => void;
  addXP: (amount: number) => void;
  setCurrentPath: (path: string) => void;
  addChatMessage: (message: ChatMessage) => void;
  addTerminalCommand: (command: TerminalCommand) => void;
  markEvidenceFound: (evidenceId: string) => void;
  useHint: (caseId: string) => void;
  resetGame: () => void;
  earnBadge: (badge: Badge) => void;
}

const initialUserProgress: UserProgress = {
  xp: 0,
  level: 1,
  completedCases: [],
  badges: [],
  hintsUsed: {},
  totalEvidenceFound: 0,
};

const initialState: GameState = {
  currentCase: null,
  userProgress: initialUserProgress,
  isPlaying: false,
  startTime: null,
  chatHistory: [],
  terminalHistory: [],
  currentPath: '/',
  foundEvidence: [],
};

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      startCase: (caseData: Case) => {
        set({
          currentCase: caseData,
          isPlaying: true,
          startTime: Date.now(),
          chatHistory: [{
            id: '1',
            role: 'system',
            content: `Case "${caseData.title}" started. Good luck, investigator!`,
            timestamp: new Date(),
          }],
          terminalHistory: [{
            command: 'system',
            output: `Investigating: ${caseData.title}\nType 'help' for available commands.`,
            timestamp: new Date(),
          }],
          currentPath: '/',
          foundEvidence: [],
        });
      },

      endCase: (completed: boolean) => {
        const state = get();
        if (!state.currentCase) return;

        const timeTaken = state.startTime ? (Date.now() - state.startTime) / 60000 : 0;
        const timeBonus = timeTaken < state.currentCase.timeLimit ? 
          Math.floor(state.currentCase.xpReward * 0.2) : 0;

        let finalXP = completed ? state.currentCase.xpReward + timeBonus : 0;
        const hintsUsed = state.userProgress.hintsUsed[state.currentCase.id] || 0;
        finalXP = Math.floor(finalXP * Math.pow(0.75, hintsUsed));

        const newXP = state.userProgress.xp + finalXP;
        const newLevel = calculateLevel(newXP);

        const newCompletedCases = completed && !state.userProgress.completedCases.includes(state.currentCase.id)
          ? [...state.userProgress.completedCases, state.currentCase.id]
          : state.userProgress.completedCases;

        set({
          isPlaying: false,
          userProgress: {
            ...state.userProgress,
            xp: newXP,
            level: newLevel,
            completedCases: newCompletedCases,
          },
        });

        if (completed) {
          // Check for badges
          const badges: Badge[] = [];
          
          // First Blood badge
          if (newCompletedCases.length === 1) {
            badges.push({
              id: 'first-blood',
              name: 'First Blood',
              icon: '🏆',
              description: 'Complete your first case',
              earnedAt: new Date(),
            });
          }
          
          // Speed Demon badge
          if (timeTaken < state.currentCase.timeLimit) {
            badges.push({
              id: 'speed-demon',
              name: 'Speed Demon',
              icon: '⚡',
              description: 'Complete case under time limit',
              earnedAt: new Date(),
            });
          }
          
          // Guided Light badge (no hints)
          if (hintsUsed === 0) {
            badges.push({
              id: 'guided-light',
              name: 'Guided Light',
              icon: '💡',
              description: 'Complete case without hints',
              earnedAt: new Date(),
            });
          }

          badges.forEach(badge => {
            if (!state.userProgress.badges.find(b => b.id === badge.id)) {
              get().earnBadge(badge);
            }
          });
        }
      },

      addXP: (amount: number) => {
        set(state => {
          const newXP = state.userProgress.xp + amount;
          const newLevel = calculateLevel(newXP);
          return {
            userProgress: {
              ...state.userProgress,
              xp: newXP,
              level: newLevel,
            },
          };
        });
      },

      setCurrentPath: (path: string) => {
        set({ currentPath: path });
      },

      addChatMessage: (message: ChatMessage) => {
        set(state => ({
          chatHistory: [...state.chatHistory, message],
        }));
      },

      addTerminalCommand: (command: TerminalCommand) => {
        set(state => ({
          terminalHistory: [...state.terminalHistory, command],
        }));
      },

      markEvidenceFound: (evidenceId: string) => {
        set(state => {
          if (state.foundEvidence.includes(evidenceId)) return state;
          
          // Update evidence in current case
          const updatedCase = state.currentCase ? {
            ...state.currentCase,
            evidence: state.currentCase.evidence.map(e =>
              e.id === evidenceId ? { ...e, isFound: true } : e
            ),
          } : null;

          return {
            foundEvidence: [...state.foundEvidence, evidenceId],
            currentCase: updatedCase,
            userProgress: {
              ...state.userProgress,
              totalEvidenceFound: state.userProgress.totalEvidenceFound + 1,
            },
          };
        });
      },

      useHint: (caseId: string) => {
        set(state => ({
          userProgress: {
            ...state.userProgress,
            hintsUsed: {
              ...state.userProgress.hintsUsed,
              [caseId]: (state.userProgress.hintsUsed[caseId] || 0) + 1,
            },
          },
        }));
      },

      earnBadge: (badge: Badge) => {
        set(state => ({
          userProgress: {
            ...state.userProgress,
            badges: [...state.userProgress.badges, badge],
          },
        }));
      },

      resetGame: () => {
        set(initialState);
      },
    }),
    {
      name: 'ai-forensic-trainer-storage',
      partialize: (state) => ({
        userProgress: state.userProgress,
      }),
    }
  )
);

export { getLevelName };
