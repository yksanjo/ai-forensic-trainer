import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { getLevelName } from '../../store/gameStore';
import './MemoryOSPanel.css';

const MemoryOSPanel: React.FC = () => {
  const { userProgress, isPlaying, currentCase } = useGameStore();

  const levelName = getLevelName(userProgress.level);

  return (
    <div className="memory-panel">
      <div className="memory-header">
        <span className="memory-icon">🧠</span>
        <span className="memory-title">MemoryOS</span>
      </div>

      <div className="memory-content">
        <div className="profile-section">
          <div className="profile-avatar">👤</div>
          <div className="profile-info">
            <span className="profile-level">Level {userProgress.level}</span>
            <span className="profile-name">{levelName}</span>
          </div>
        </div>

        <div className="stats-section">
          <div className="memory-stat">
            <span className="stat-label">Total XP</span>
            <span className="stat-value">{userProgress.xp.toLocaleString()}</span>
          </div>
          <div className="memory-stat">
            <span className="stat-label">Cases Solved</span>
            <span className="stat-value">{userProgress.completedCases.length}</span>
          </div>
          <div className="memory-stat">
            <span className="stat-label">Evidence Found</span>
            <span className="stat-value">{userProgress.totalEvidenceFound}</span>
          </div>
        </div>

        {userProgress.badges.length > 0 && (
          <div className="badges-section">
            <h4>Achievements</h4>
            <div className="badges-grid">
              {userProgress.badges.map((badge) => (
                <div key={badge.id} className="badge-item" title={badge.description}>
                  <span className="badge-icon">{badge.icon}</span>
                  <span className="badge-name">{badge.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {isPlaying && currentCase && (
          <div className="case-progress">
            <h4>Current Investigation</h4>
            <div className="case-progress-info">
              <span className="case-name">{currentCase.title}</span>
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${(userProgress.totalEvidenceFound / currentCase.evidence.length) * 100}%` }}
                />
              </div>
              <span className="progress-text">
                {currentCase.evidence.filter(e => userProgress.completedCases.includes(e.id)).length} / {currentCase.evidence.length} evidence found
              </span>
            </div>
          </div>
        )}

        <div className="skills-section">
          <h4>Forensics Skills</h4>
          <div className="skills-list">
            <div className="skill-item">
              <span className="skill-icon">📧</span>
              <span className="skill-name">Email Analysis</span>
              <div className="skill-bar">
                <div className="skill-fill" style={{ width: userProgress.completedCases.filter(id => id.includes('phishing')).length > 0 ? '100%' : '0%' }} />
              </div>
            </div>
            <div className="skill-item">
              <span className="skill-icon">🐞</span>
              <span className="skill-name">Malware Analysis</span>
              <div className="skill-bar">
                <div className="skill-fill" style={{ width: userProgress.completedCases.filter(id => id.includes('malware')).length > 0 ? '100%' : '0%' }} />
              </div>
            </div>
            <div className="skill-item">
              <span className="skill-icon">🚨</span>
              <span className="skill-name">Incident Response</span>
              <div className="skill-bar">
                <div className="skill-fill" style={{ width: userProgress.completedCases.length > 0 ? '100%' : '0%' }} />
              </div>
            </div>
            <div className="skill-item">
              <span className="skill-icon">📊</span>
              <span className="skill-name">Log Analysis</span>
              <div className="skill-bar">
                <div className="skill-fill" style={{ width: userProgress.completedCases.length > 0 ? '100%' : '0%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemoryOSPanel;
