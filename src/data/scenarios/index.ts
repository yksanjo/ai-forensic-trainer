import type { Case } from '../../types';
import { phishingAttackScenario } from './phishing-attack';
import { ransomwareIncidentScenario } from './ransomware-incident';

export const scenarios: Case[] = [
  phishingAttackScenario,
  ransomwareIncidentScenario,
];

export const getScenarioById = (id: string): Case | undefined => {
  return scenarios.find(s => s.id === id);
};

export const getScenariosByDifficulty = (difficulty: Case['difficulty']): Case[] => {
  return scenarios.filter(s => s.difficulty === difficulty);
};

export const getScenariosByCategory = (category: Case['category']): Case[] => {
  return scenarios.filter(s => s.category === category);
};

export { phishingAttackScenario, ransomwareIncidentScenario };
