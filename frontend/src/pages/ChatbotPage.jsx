import React, { useState, useRef, useEffect } from 'react';
import './ChatbotPage.css';

function setMaxWidthAndHeight() {
    document.documentElement.style.setProperty('--max-width', `${window.innerWidth - 40}px`);
    document.documentElement.style.setProperty('--max-height', `${window.innerHeight - 40}px`);
  }



const ChatbotPage = () => {
  document.documentElement.style.setProperty('--max-width', `${window.innerWidth - 40}px`);
  document.documentElement.style.setProperty('--max-height', `${window.innerHeight - 40}px`);
  window.addEventListener('resize', setMaxWidthAndHeight);
  window.addEventListener('load', setMaxWidthAndHeight);
  
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const handleSendMessage = () => {
    if (input.trim() === '') return;

    const userMessage = { text: input, sender: 'user' };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput('');

    // Simulazione della risposta del chatbot
    setTimeout(() => {
      const botMessage = { text: `Hai detto: ${input}`, sender: 'bot' };
      setMessages(prevMessages => [...prevMessages, botMessage]);
    }, 1000);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="chatbot-page">
      <div className="header">
        <div className="logo">
            
        </div>
        <div className="title">CADOCS II</div>
      </div>
      <div className="message-container">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef}></div>
      </div>
      <div className="user-input">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
          placeholder="Chiedi a CADOCS."
        />
        <button onClick={handleSendMessage}>Invia</button>
      </div>
    </div>
  );
};

export default ChatbotPage;
