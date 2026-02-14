import React, { useState, useRef, useEffect } from 'react';
import { useGameStore } from '../../store/gameStore';
import { generateAIResponse, getInitialGreeting } from '../../services/aiService';
import type { ChatMessage } from '../../types';
import './AICoInvestigator.css';

const AICoInvestigator: React.FC = () => {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { 
    currentCase, 
    chatHistory, 
    addChatMessage,
    useHint,
  } = useGameStore();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  useEffect(() => {
    if (currentCase && chatHistory.length === 1) {
      // Add initial greeting when case starts
      const greeting: ChatMessage = {
        id: 'greeting',
        role: 'assistant',
        content: getInitialGreeting(currentCase.title),
        timestamp: new Date(),
      };
      addChatMessage(greeting);
    }
  }, [currentCase, chatHistory.length, addChatMessage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const message = input.trim();
    if (!message || !currentCase) return;
    
    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      role: 'user' as const,
      content: message,
      timestamp: new Date(),
    };
    addChatMessage(userMessage);
    setInput('');
    
    // Check if asking for hint (costs XP)
    const isHintRequest = message.toLowerCase().includes('hint');
    if (isHintRequest && currentCase) {
      useHint(currentCase.id);
    }
    
    // Show typing indicator
    setIsTyping(true);
    
    try {
      const response = await generateAIResponse(message, currentCase, chatHistory);
      
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant' as const,
        content: response,
        timestamp: new Date(),
      };
      addChatMessage(aiMessage);
    } catch (error) {
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant' as const,
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      addChatMessage(errorMessage);
    } finally {
      setIsTyping(false);
    }
  };

  const formatMessage = (content: string) => {
    return content.split('\n').map((line, i) => {
      // Handle bold text
      const boldRegex = /\*\*(.*?)\*\*/g;
      const parts = line.split(boldRegex);
      
      return (
        <div key={i}>
          {parts.map((part, j) => 
            j % 2 === 1 ? <strong key={j}>{part}</strong> : part
          )}
        </div>
      );
    });
  };

  if (!currentCase) {
    return (
      <div className="ai-panel">
        <div className="ai-header">
          <span className="ai-icon">🤖</span>
          <span className="ai-title">AI Co-Investigator</span>
        </div>
        <div className="ai-empty">
          <p>Start a case to activate your AI assistant</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ai-panel">
      <div className="ai-header">
        <span className="ai-icon">🤖</span>
        <span className="ai-title">AI Co-Investigator</span>
        <span className="ai-status">Online</span>
      </div>
      
      <div className="ai-messages">
        {chatHistory.map((msg) => (
          <div 
            key={msg.id} 
            className={`ai-message ${msg.role === 'user' ? 'user' : msg.role === 'assistant' ? 'assistant' : 'system'}`}
          >
            {msg.role === 'user' ? (
              <div className="message-content">{msg.content}</div>
            ) : msg.role === 'system' ? (
              <div className="message-content system-msg">{msg.content}</div>
            ) : (
              <div className="message-content">{formatMessage(msg.content)}</div>
            )}
          </div>
        ))}
        
        {isTyping && (
          <div className="ai-message assistant">
            <div className="message-content typing">
              <span className="typing-dot">.</span>
              <span className="typing-dot">.</span>
              <span className="typing-dot">.</span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSubmit} className="ai-input-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask for hints or analysis..."
          className="ai-input"
          disabled={isTyping}
        />
        <button type="submit" className="ai-send-btn" disabled={isTyping || !input.trim()}>
          ➤
        </button>
      </form>
      
      <div className="ai-hints-info">
        <span className="hint-warning">⚠️ Using hints reduces XP by 25%</span>
      </div>
    </div>
  );
};

export default AICoInvestigator;
