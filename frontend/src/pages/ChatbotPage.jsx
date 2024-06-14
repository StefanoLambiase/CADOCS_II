import React, { useState, useRef, useEffect } from 'react';
import './ChatbotPage.css';



const ChatbotPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  // Funzione per gestire l'invio del messaggio
  const handleSendMessage = async () => {
    if (input.trim() === '') return;

    // Aggiungi il messaggio dell'utente alla lista dei messaggi
    const userMessage = { text: input, sender: 'user' };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput('');

    try {
      // Invia il messaggio all'endpoint specificato
      const response = await fetch('http://127.0.0.1:5005/resolve_intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      // Assicurati che `data.message` contenga il testo con \n
      const botMessageText = processMessage(data|| JSON.stringify(data));

      // Aggiungi il messaggio del bot alla lista dei messaggi
      const botMessage = { text: botMessageText, sender: 'bot' };
      setMessages(prevMessages => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Errore nella richiesta:', error);
      const botMessage = { text: 'Si è verificato un errore. Riprova più tardi.', sender: 'bot' };
      setMessages(prevMessages => [...prevMessages, botMessage]);
    }
  };

  // Funzione per processare il testo del messaggio (rimuovere virgolette, sostituire \n con <br> e gestire i link)
  const processMessage = (text) => {
    if (text.startsWith('"') && text.endsWith('"')) {
      text = text.substring(1, text.length - 1);
    }
    
    // Rileva i link nel testo e convertili in tag <a> HTML
    text = text.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>');

    // Sostituisci \n con <br>
    return text.split('\n').join('<br>');
  };

  // Effetto per far scorrere automaticamente verso il basso quando si aggiungono nuovi messaggi
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="chatbot-page">
      <div className="header">
        <div className="logo">
          {/* Inserisci il logo qui */}
        </div>
        <div className="title">CADOCS II</div>
      </div>
      <div className="message-container">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            {msg.sender === 'bot' ? (
              <div dangerouslySetInnerHTML={{ __html: msg.text }} />
            ) : (
              <div>{msg.text}</div>
            )}
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