import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import './Sidebar.css';

type Tab = 'cases' | 'evidence' | 'tools' | 'ai';

const Sidebar: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('cases');
  const { isPlaying, currentCase, foundEvidence, userProgress } = useGameStore();

  const tabs = [
    { id: 'cases' as Tab, label: '📁 Cases', icon: '📁' },
    { id: 'evidence' as Tab, label: '🔍 Evidence', icon: '🔍' },
    { id: 'tools' as Tab, label: '🛠️ Tools', icon: '🛠️' },
    { id: 'ai' as Tab, label: '🤖 AI Assistant', icon: '🤖' },
  ];

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="nav-icon">{tab.icon}</span>
            <span className="nav-label">{tab.label}</span>
            {tab.id === 'evidence' && isPlaying && (
              <span className="nav-badge">
                {foundEvidence.length}/{currentCase?.evidence.length || 0}
              </span>
            )}
          </button>
        ))}
      </nav>

      <div className="sidebar-content">
        {activeTab === 'cases' && (
          <div className="content-panel">
            <h3>Case Manager</h3>
            <p>Select a case to begin your investigation</p>
          </div>
        )}
        
        {activeTab === 'evidence' && (
          <div className="content-panel">
            <h3>Evidence Tracker</h3>
            {isPlaying && currentCase ? (
              <ul className="evidence-list">
                {currentCase.evidence.map((ev) => (
                  <li key={ev.id} className={foundEvidence.includes(ev.id) ? 'found' : ''}>
                    <span className="ev-status">{foundEvidence.includes(ev.id) ? '✓' : '○'}</span>
                    <span className="ev-name">{ev.name}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="empty-state">Start a case to track evidence</p>
            )}
          </div>
        )}
        
        {activeTab === 'tools' && (
          <div className="content-panel">
            <h3>Forensics Tools</h3>
            <ul className="tools-list">
              <li>
                <span className="tool-icon">📧</span>
                <span>Email Parser</span>
              </li>
              <li>
                <span className="tool-icon">📊</span>
                <span>Log Analyzer</span>
              </li>
              <li>
                <span className="tool-icon">🔐</span>
                <span>Hash Calculator</span>
              </li>
              <li>
                <span className="tool-icon">🌐</span>
                <span>Network Scanner</span>
              </li>
              <li>
                <span className="tool-icon">💾</span>
                <span>Registry Viewer</span>
              </li>
              <li>
                <span className="tool-icon">📝</span>
                <span>Timeline Builder</span>
              </li>
            </ul>
          </div>
        )}
        
        {activeTab === 'ai' && (
          <div className="content-panel">
            <h3>AI Co-Investigator</h3>
            <p>Ask for hints and analysis</p>
            <div className="quick-commands">
              <button className="quick-btn">💡 Give me a hint</button>
              <button className="quick-btn">📋 What have I found?</button>
              <button className="quick-btn">🔍 Analyze this file</button>
            </div>
          </div>
        )}
      </div>

      <div className="sidebar-footer">
        <div className="quick-stats">
          <span>XP: {userProgress.xp}</span>
          <span>Level: {userProgress.level}</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
