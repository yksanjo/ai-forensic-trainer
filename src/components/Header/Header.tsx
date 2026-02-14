import React from 'react';
import { useGameStore, getLevelName } from '../../store/gameStore';
import './Header.css';

const Header: React.FC = () => {
  const { userProgress, isPlaying, currentCase } = useGameStore();

  const levelName = getLevelName(userProgress.level);
  const xpToNextLevel = userProgress.level < 5 
    ? [0, 1000, 5000, 15000, 50000][userProgress.level] - userProgress.xp
    : 0;

  return (
    <header className="app-header">
      <div className="header-left">
        <div className="logo">
          <span className="logo-icon">🔬</span>
          <span className="logo-text">AI Forensics Trainer</span>
        </div>
      </div>

      <div className="header-center">
        {isPlaying && currentCase && (
          <div className="active-case-indicator">
            <span className="pulse-dot"></span>
            <span>Investigating: {currentCase.title}</span>
          </div>
        )}
      </div>

      <div className="header-right">
        <div className="user-stats">
          <div className="stat-item level">
            <span className="stat-icon">⭐</span>
            <div className="stat-details">
              <span className="stat-value">Level {userProgress.level}</span>
              <span className="stat-label">{levelName}</span>
            </div>
          </div>
          
          <div className="stat-item xp">
            <span className="stat-icon">⚡</span>
            <div className="stat-details">
              <span className="stat-value">{userProgress.xp.toLocaleString()} XP</span>
              {userProgress.level < 5 && (
                <span className="stat-label">{xpToNextLevel.toLocaleString()} to next</span>
              )}
            </div>
          </div>

          <div className="stat-item evidence">
            <span className="stat-icon">🔍</span>
            <div className="stat-details">
              <span className="stat-value">{userProgress.totalEvidenceFound}</span>
              <span className="stat-label">Evidence Found</span>
            </div>
          </div>

          <div className="stat-item cases">
            <span className="stat-icon">📁</span>
            <div className="stat-details">
              <span className="stat-value">{userProgress.completedCases.length}</span>
              <span className="stat-label">Cases Solved</span>
            </div>
          </div>
        </div>

        <div className="badges">
          {userProgress.badges.slice(0, 3).map((badge) => (
            <span key={badge.id} className="badge" title={badge.description}>
              {badge.icon}
            </span>
          ))}
          {userProgress.badges.length > 3 && (
            <span className="badge more">+{userProgress.badges.length - 3}</span>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
