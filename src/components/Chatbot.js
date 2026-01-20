import React, { useState, useEffect, useRef } from 'react';
import './Chatbot.css';
import { processUserInput, loadChatHistory, saveChatHistory, clearChatHistory } from '../utils/chatbotLogic';

function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState({ type: 'happy', emoji: '😊' });
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Load chat history on component mount
  useEffect(() => {
    const history = loadChatHistory();
    if (history.length > 0) {
      setMessages(history);
    } else {
      // Initial welcome message
      const welcomeMessage = {
        text: "Hello! I'm Mini Chatbot. How can I help you today? 😊",
        sender: 'bot',
        timestamp: new Date().toISOString(),
        emotion: { type: 'happy', emoji: '😊' }
      };
      setMessages([welcomeMessage]);
      setCurrentEmotion({ type: 'happy', emoji: '😊' });
    }
  }, []);

  // Save chat history whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      saveChatHistory(messages);
    }
  }, [messages]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = (e) => {
    e.preventDefault();
    
    if (!input.trim()) return;

    const userMessage = {
      text: input.trim(),
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate thinking delay for better UX
    setTimeout(() => {
      // Get conversation context (last 5 messages for context)
      const recentMessages = messages.slice(-5).map(msg => ({
        text: msg.text,
        sender: msg.sender
      }));
      
      const context = {
        recentMessages: recentMessages,
        conversationHistory: messages
      };
      
      const response = processUserInput(userMessage.text, context);
      const botMessage = {
        text: response.text,
        sender: 'bot',
        timestamp: new Date().toISOString(),
        emotion: response.emotion
      };

      setCurrentEmotion(response.emotion);
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 500);
  };

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear the chat history?')) {
      clearChatHistory();
      const welcomeMessage = {
        text: "Hello! I'm Mini Chatbot. How can I help you today? 😊",
        sender: 'bot',
        timestamp: new Date().toISOString(),
        emotion: { type: 'happy', emoji: '😊' }
      };
      setMessages([welcomeMessage]);
      setCurrentEmotion({ type: 'happy', emoji: '😊' });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <div className="emotion-indicator" title={`Current mood: ${currentEmotion.type}`}>
          <span className="emotion-emoji">{currentEmotion.emoji}</span>
          <span className="emotion-label">{currentEmotion.type}</span>
        </div>
        <div className="header-content">
          <div className="header-text">
            <h1>🤖 Mini Chatbot</h1>
            <p>Powered by React & NLP</p>
          </div>
        </div>
        <button className="clear-btn" onClick={handleClearHistory} title="Clear chat history">
          🗑️ Clear
        </button>
      </div>
      
      <div className="chatbot-messages">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
          >
            <div className="message-content">
              {message.sender === 'bot' && message.emotion && (
                <span className="message-emotion" title={`Feeling ${message.emotion.type}`}>
                  {message.emotion.emoji}
                </span>
              )}
              <span className="message-text">
                {message.text.split('\n').map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    {i < message.text.split('\n').length - 1 && <br />}
                  </React.Fragment>
                ))}
              </span>
            </div>
            <div className="message-timestamp">
              {new Date(message.timestamp).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="message bot-message">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <form className="chatbot-input-form" onSubmit={handleSend}>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message here..."
          className="chatbot-input"
          disabled={isTyping}
        />
        <button 
          type="submit" 
          className="send-button"
          disabled={!input.trim() || isTyping}
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default Chatbot;
