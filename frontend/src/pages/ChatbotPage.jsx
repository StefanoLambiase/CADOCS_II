import React, { useState, useRef, useEffect } from 'react';
import './ChatbotPage.css';
import logoPath from "../images/bot.png";

const ChatbotPage = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Messaggio di benvenuto del bot
    const welcomeMessage = "Hello! 👋<br> I'm Cadocs, your virtual assistant. I'm here to help you identify 'community smells' and improve team collaboration. If you have any questions or need assistance, feel free to ask!<br><br>Ciao! 👋<br> Sono Cadocs, il tuo assistente virtuale. Sono qui per aiutarti a individuare i 'community smells' e migliorare la collaborazione nel tuo team. Se hai domande o hai bisogno di assistenza, chiedimi pure!";
    setLoading(true);

    // Simulazione di un breve ritardo per il messaggio di benvenuto
    setTimeout(() => {
      setMessages([{ type: 'bot', text: welcomeMessage }]);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let loadingInterval;
    if (loading) {
      let catCount = 1;
      loadingInterval = setInterval(() => {
        setLoadingMessage('😺'.repeat(catCount));
        catCount = catCount % 7 + 1; // Ciclo tra 1 e 7 gatti
      }, 500);
    } else {
      setLoadingMessage('');
      clearInterval(loadingInterval);
    }
    return () => clearInterval(loadingInterval);
  }, [loading]);

  const handleSendMessage = async () => {
    if (userInput.trim() === '') return;

    // Aggiungi il messaggio dell'utente
    setMessages([...messages, { type: 'user', text: userInput }]);
    setUserInput('');
    setLoading(true);

    // Effettua una richiesta al server
    try {
      const serverResponse = await fetchServerResponse(userInput);
      // Aggiungi la risposta del server
      setMessages([...messages, { type: 'user', text: userInput }, { type: 'bot', text: serverResponse }]);
    } catch (error) {
      console.error('Errore nella richiesta al server:', error);
      setMessages([...messages, { type: 'user', text: userInput }, { type: 'bot', text: 'Errore nella risposta del server.' }]);
    } finally {
      setLoading(false);
    }
  };

  // Funzione per processare il testo del messaggio (rimuovere virgolette, sostituire \n con <br> e gestire i link)
  const processMessage = (text) => {
    if (text.startsWith('"') && text.endsWith('"')) {
      text = text.substring(1, text.length - 1);
    }
    
    // Rileva i link nel testo e convertili in tag <a> HTML
    text = text.replace(/<(https?:\/\/[^\s]+)>/g, '<a href="$1" target="_blank">$1</a>');

    // se c'è un messaggio contenuto in * * (asterischi), rendilo in grassetto
    text = text.replace(/\*([^*]+)\*/g, '<b>$1</b>');

    //se c'è un messaggio contenuto in _ _ (underscore), rendilo in corsivo
    text = text.replace(/_([^_]+)_/g, '<i>$1</i>');

    //Se c'è ----------------------------, sostituisci con una linea orizzontale nera con margin top di 10px
    text = text.replace(/-{28,}/g, '<hr style="border-top: 1px solid black; margin-top: 10px;">');

    // Sostituisci \n con <br>
    return text.split('\n').join('<br>');
  };

  // Effetto per far scorrere automaticamente verso il basso quando si aggiungono nuovi messaggi
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Gestore di eventi per il tasto Invio
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  };

  // Funzione per effettuare la richiesta al server
  const fetchServerResponse = async (input) => {
    const response = await fetch('http://127.0.0.1:5005/resolve_intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: input }),
    });
    if (!response.ok) {
      throw new Error('Errore nella richiesta al server');
    }
    const data = await response.json();
    return processMessage(data); // Supponendo che il server restituisca un campo 'response'
  };

  return (
    <div className="chatbot-page">
      <div className='chatbot-header'>
        <img className="chatbot-logo" src={logoPath} alt='Avatar' />
        <div className='chatbot-name'>CADOCS</div>
      </div>
      <div className="message-container">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.type}`}>
            {message.type === 'bot' ? (
              <div dangerouslySetInnerHTML={{ __html: message.text }} />
            ) : (
              <div>{message.text}</div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef}></div>
        {loading && (
          <div className="message bot loading-message">
            {loadingMessage}
          </div>
        )}
      </div>
      <div className="user-input">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyPress={handleKeyPress} // Aggiungi gestore di eventi
          placeholder="Scrivi un messaggio..."
        />
        <button onClick={handleSendMessage}>Invia</button>
      </div>
    </div>
  );
};

export default ChatbotPage;
