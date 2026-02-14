import React from 'react';
import { useGameStore } from './store/gameStore';
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import Terminal from './components/Terminal/Terminal';
import AICoInvestigator from './components/AICoInvestigator/AICoInvestigator';
import CaseManager from './components/CaseManager/CaseManager';
import MemoryOSPanel from './components/MemoryOSPanel/MemoryOSPanel';
import './index.css';

const App: React.FC = () => {
  const { isPlaying, userProgress } = useGameStore();

  return (
    <div className="app">
      <Header />
      
      <div className="app-main">
        <Sidebar />
        
        <main className="app-content">
          {isPlaying ? (
            <div className="content-area">
              <div className="main-panel">
                <Terminal />
              </div>
              <div className="secondary-panel">
                <AICoInvestigator />
                <MemoryOSPanel />
              </div>
            </div>
          ) : (
            <div className="welcome-screen">
              <div className="welcome-icon">🔬</div>
              <h1 className="welcome-title">AI Forensic Investigator Trainer</h1>
              <p className="welcome-subtitle">
                CTF meets AI Copilot for digital forensics training.
                Investigate realistic cyber incidents, gather evidence, and learn
                cutting-edge forensics techniques.
              </p>
              
              <div className="welcome-stats">
                <div className="welcome-stat">
                  <div className="welcome-stat-value">{userProgress.xp.toLocaleString()}</div>
                  <div className="welcome-stat-label">Total XP</div>
                </div>
                <div className="welcome-stat">
                  <div className="welcome-stat-value">{userProgress.level}</div>
                  <div className="welcome-stat-label">Level</div>
                </div>
                <div className="welcome-stat">
                  <div className="welcome-stat-value">{userProgress.completedCases.length}</div>
                  <div className="welcome-stat-label">Cases Solved</div>
                </div>
                <div className="welcome-stat">
                  <div className="welcome-stat-value">{userProgress.totalEvidenceFound}</div>
                  <div className="welcome-stat-label">Evidence Found</div>
                </div>
              </div>
              
              <CaseManager />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
