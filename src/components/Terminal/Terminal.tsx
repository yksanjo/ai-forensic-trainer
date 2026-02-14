import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useGameStore } from '../../store/gameStore';
import { findFileByPath, getDirectoryContents, resolvePath } from '../../utils/fileSystem';
import type { FileNode, TerminalCommand } from '../../types';
import './Terminal.css';

const Terminal: React.FC = () => {
  const [input, setInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  
  const { 
    currentCase, 
    currentPath, 
    setCurrentPath,
    addTerminalCommand,
    markEvidenceFound,
    foundEvidence,
    terminalHistory,
  } = useGameStore();

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalHistory]);

  const focusInput = () => {
    inputRef.current?.focus();
  };

  const getCurrentDirectory = useCallback((): FileNode | null => {
    if (!currentCase?.fileSystem) return null;
    return findFileByPath(currentCase.fileSystem, currentPath);
  }, [currentCase?.fileSystem, currentPath]);

  const checkForEvidence = useCallback((path: string) => {
    if (!currentCase) return;
    
    const normalizedPath = path.replace(/\\/g, '/').toLowerCase();
    for (const evidence of currentCase.evidence) {
      const evidencePath = evidence.path.replace(/\\/g, '/').toLowerCase();
      if (normalizedPath.includes(evidencePath) || evidencePath.includes(normalizedPath)) {
        if (!foundEvidence.includes(evidence.id)) {
          markEvidenceFound(evidence.id);
          return `\n\n⚠️  EVIDENCE FOUND: ${evidence.name}\n    ${evidence.description}`;
        }
      }
    }
    return '';
  }, [currentCase, foundEvidence, markEvidenceFound]);

  const executeCommand = useCallback((cmd: string): string => {
    if (!currentCase?.fileSystem) return 'No case loaded.';
    
    const parts = cmd.trim().toLowerCase().split(/\s+/);
    const command = parts[0];
    const args = parts.slice(1).join(' ');
    
    switch (command) {
      case 'help':
        return `Available commands:
  ls, dir     - List directory contents
  cd <path>   - Change directory
  pwd         - Print working directory
  type <file> - Display file contents (alias: cat)
  cat <file>  - Display file contents
  clear       - Clear terminal
  whoami      - Display current user
  ipconfig    - Display network configuration
  netstat     - Display network connections
  systeminfo  - Display system information
  exit        - Exit current case`;

      case 'clear':
        useGameStore.setState(state => ({
          ...state,
          terminalHistory: [],
        }));
        return '';

      case 'pwd':
        return currentPath.replace(/\//g, '\\');

      case 'ls':
      case 'dir': {
        const contents = getDirectoryContents(currentCase.fileSystem, currentPath);
        if (contents.length === 0) return '(empty directory)';
        
        return contents.map(item => {
          const isDir = item.type === 'directory';
          const color = isDir ? 'var(--accent-primary)' : 'var(--text-secondary)';
          const suffix = isDir ? '\\' : '';
          const isEvidence = currentCase.evidence.some(
            e => item.name.toLowerCase() === e.name.toLowerCase()
          );
          const prefix = isEvidence ? '📁 ' : (isDir ? '📂 ' : '📄 ');
          return `${prefix}${item.name}${suffix}`;
        }).join('\n');
      }

      case 'cd': {
        if (!args) return currentPath.replace(/\//g, '\\');
        
        if (args === '..') {
          const parts = currentPath.replace(/\\/g, '/').split('/').filter(Boolean);
          parts.pop();
          const newPath = parts.length === 0 ? '/' : '/' + parts.join('/');
          setCurrentPath(newPath);
          return '';
        }
        
        if (args === '/') {
          setCurrentPath('/');
          return '';
        }
        
        const newPath = resolvePath(currentPath, args);
        const target = findFileByPath(currentCase.fileSystem, newPath);
        
        if (!target) return `Path not found: ${args}`;
        if (target.type !== 'directory') return `${args} is not a directory`;
        
        setCurrentPath(newPath);
        return '';
      }

      case 'type':
      case 'cat': {
        if (!args) return 'Usage: type <filename>';
        
        const targetPath = resolvePath(currentPath, args);
        const target = findFileByPath(currentCase.fileSystem, targetPath);
        
        if (!target) return `File not found: ${args}`;
        if (target.type === 'directory') return `${args} is a directory`;
        
        const evidenceAlert = checkForEvidence(targetPath);
        return (target.content || '(empty file)') + (evidenceAlert || '');
      }

      case 'whoami':
        return 'abc\\jsmith';

      case 'ipconfig':
        return `Windows IP Configuration

Ethernet adapter Ethernet0:

   Connection-specific DNS Suffix  . : abc.corp.local
   IPv4 Address. . . . . . . . . . . : 192.168.1.105
   Subnet Mask . . . . . . . . . . . : 255.255.255.0
   Default Gateway . . . . . . . . . : 192.168.1.1`;

      case 'netstat':
        return `Active Connections

  Proto  Local Address          Foreign Address        State
  TCP    192.168.1.105:139      0.0.0.0:0              LISTENING
  TCP    192.168.1.105:445      192.168.1.1:139        ESTABLISHED
  TCP    192.168.1.105:50768    192.168.1.100:3389    ESTABLISHED
  TCP    192.168.1.105:51876    192.168.1.100:80     TIME_WAIT`;

      case 'systeminfo':
        return `Host Name:           DESKTOP-JSMITH
OS Name:           Microsoft Windows 10 Pro
OS Version:        10.0.19045 N/A Build 19045
System Type:       x64-based PC
Processor:         Intel(R) Core(TM) i7-10700 CPU @ 2.90GHz
Domain:            abc.corp.local
Logged On User:    jsmith`;

      case 'exit':
        return 'Use the Case Manager to leave this investigation.';

      default:
        return `'${command}' is not recognized as an internal or external command.`;
    }
  }, [currentCase, currentPath, setCurrentPath, checkForEvidence]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedInput = input.trim();
    if (!trimmedInput) return;
    
    const output = executeCommand(trimmedInput);
    
    if (trimmedInput.toLowerCase() !== 'clear') {
      addTerminalCommand({
        command: trimmedInput,
        output,
        timestamp: new Date(),
      });
    }
    
    setCommandHistory(prev => [...prev, trimmedInput]);
    setHistoryIndex(-1);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setInput('');
        } else {
          setHistoryIndex(newIndex);
          setInput(commandHistory[newIndex]);
        }
      }
    }
  };

  const formatOutput = (output: string) => {
    if (!output) return null;
    return output.split('\n').map((line, i) => (
      <div key={i}>{line || '\u00A0'}</div>
    ));
  };

  return (
    <div className="terminal-container" onClick={focusInput}>
      <div className="terminal-header">
        <span className="terminal-title">⚡ PowerShell</span>
        <span className="terminal-path">{currentPath.replace(/\//g, '\\')}</span>
      </div>
      <div className="terminal-body" ref={terminalRef}>
        {terminalHistory.map((entry: TerminalCommand, index: number) => (
          <div key={index} className="terminal-entry">
            <div className="terminal-command-line">
              <span className="terminal-prompt">PS {'>'}</span>
              <span className="terminal-command">{entry.command}</span>
            </div>
            {entry.output && (
              <div className="terminal-output">
                {formatOutput(entry.output)}
              </div>
            )}
          </div>
        ))}
        <form onSubmit={handleSubmit} className="terminal-input-line">
          <span className="terminal-prompt">PS {'>'}</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="terminal-input"
            autoComplete="off"
            spellCheck={false}
          />
        </form>
      </div>
      <div className="terminal-scanlines" />
    </div>
  );
};

export default Terminal;
