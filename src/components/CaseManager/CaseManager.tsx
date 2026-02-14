import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { scenarios } from '../../data/scenarios';
import type { Case } from '../../types';
import './CaseManager.css';

const CaseManager: React.FC = () => {
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const { startCase, userProgress, isPlaying, currentCase, endCase, foundEvidence } = useGameStore();

  const handleStartCase = (caseData: Case) => {
    startCase(caseData);
    setSelectedCase(null);
  };

  const handleEndCase = () => {
    if (currentCase) {
      const allEvidenceFound = currentCase.evidence.every(e => 
        foundEvidence.includes(e.id)
      );
      endCase(allEvidenceFound);
    }
  };

  const getDifficultyColor = (difficulty: Case['difficulty']) => {
    switch (difficulty) {
      case 'Beginner': return 'var(--success-color)';
      case 'Intermediate': return 'var(--accent-primary)';
      case 'Advanced': return 'var(--alert-color)';
      case 'Expert': return 'var(--critical-color)';
      default: return 'var(--text-secondary)';
    }
  };

  const isCaseCompleted = (caseId: string) => {
    return userProgress.completedCases.includes(caseId);
  };

  if (isPlaying && currentCase) {
    return (
      <div className="case-manager active-case">
        <div className="active-case-header">
          <div className="case-info">
            <h2>{currentCase.title}</h2>
            <span className="case-difficulty" style={{ color: getDifficultyColor(currentCase.difficulty) }}>
              {currentCase.difficulty}
            </span>
          </div>
          <div className="case-stats">
            <div className="stat">
              <span className="stat-label">Evidence</span>
              <span className="stat-value">{foundEvidence.length}/{currentCase.evidence.length}</span>
            </div>
            <div className="stat">
              <span className="stat-label">XP</span>
              <span className="stat-value">{currentCase.xpReward}</span>
            </div>
          </div>
        </div>
        
        <div className="case-objectives">
          <h3>Objectives</h3>
          <ul>
            {currentCase.objectives.map((obj, index) => (
              <li key={obj.id} className={obj.isCompleted ? 'completed' : ''}>
                <span className="obj-number">{index + 1}</span>
                <span className="obj-desc">{obj.description}</span>
                <span className="obj-xp">+{obj.xpReward} XP</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="case-briefing">
          <h3>Case Briefing</h3>
          <pre>{currentCase.briefing}</pre>
        </div>
        
        <button className="end-case-btn" onClick={handleEndCase}>
          Submit Case Findings
        </button>
      </div>
    );
  }

  return (
    <div className="case-manager">
      <div className="case-manager-header">
        <h2>📁 Case Files</h2>
        <div className="case-count">{scenarios.length} Cases Available</div>
      </div>
      
      <div className="case-list">
        {scenarios.map((scenario) => {
          const completed = isCaseCompleted(scenario.id);
          return (
            <div 
              key={scenario.id} 
              className={`case-card ${completed ? 'completed' : ''}`}
              onClick={() => setSelectedCase(scenario)}
            >
              <div className="case-card-header">
                <span className="case-category">{scenario.category}</span>
                {completed && <span className="case-badge">✓ Solved</span>}
              </div>
              <h3 className="case-title">{scenario.title}</h3>
              <p className="case-desc">{scenario.description}</p>
              <div className="case-meta">
                <span className="case-difficulty" style={{ color: getDifficultyColor(scenario.difficulty) }}>
                  {scenario.difficulty}
                </span>
                <span className="case-xp">+{scenario.xpReward} XP</span>
                <span className="case-time">{scenario.timeLimit} min</span>
              </div>
            </div>
          );
        })}
      </div>

      {selectedCase && (
        <div className="case-modal" onClick={() => setSelectedCase(null)}>
          <div className="case-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedCase(null)}>×</button>
            
            <div className="modal-header">
              <span className="case-category">{selectedCase.category}</span>
              <h2>{selectedCase.title}</h2>
              <div className="case-meta">
                <span className="case-difficulty" style={{ color: getDifficultyColor(selectedCase.difficulty) }}>
                  {selectedCase.difficulty}
                </span>
                <span className="case-xp">+{selectedCase.xpReward} XP</span>
                <span className="case-time">⏱ {selectedCase.timeLimit} min</span>
              </div>
            </div>
            
            <div className="modal-body">
              <div className="modal-section">
                <h3>Description</h3>
                <p>{selectedCase.description}</p>
              </div>
              
              <div className="modal-section">
                <h3>Objectives</h3>
                <ul className="objectives-list">
                  {selectedCase.objectives.map((obj) => (
                    <li key={obj.id}>
                      <span>• {obj.description}</span>
                      <span className="obj-xp">+{obj.xpReward} XP</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="modal-section">
                <h3>Briefing</h3>
                <pre className="briefing-text">{selectedCase.briefing}</pre>
              </div>
            </div>
            
            <div className="modal-footer">
              <button 
                className="start-case-btn"
                onClick={() => handleStartCase(selectedCase)}
              >
                🔍 Start Investigation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaseManager;
