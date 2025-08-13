import React, { useState, useEffect, useRef } from 'react';
import { Button, Form, InputGroup, Spinner } from 'react-bootstrap';
// UPDATED: Import the User icon
import { Bot, Send, User } from 'lucide-react';
import axios from 'axios';

interface Message {
  role: 'user' | 'model';
  parts: [{ text: string }];
}

const Chatbot: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'model', parts: [{ text: "Hello! I'm your AI assistant. Ask me anything about your project analysis." }] }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = async () => {
        if (input.trim() === '' || isLoading) return;

        const userMessage: Message = { role: 'user', parts: [{ text: input }] };
        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
        setInput('');
        setIsLoading(true);

        try {
            const history = updatedMessages.slice(1);

            const response = await axios.post('http://localhost:3001/api/chat', {
                message: input,
                history: history,
            });
            
            const botResponse: Message = { role: 'model', parts: [{ text: response.data.reply }] };
            setMessages(prev => [...prev, botResponse]);

        } catch (error) {
            console.error("Chatbot API error:", error);
            const errorResponse: Message = { role: 'model', parts: [{ text: "Sorry, I couldn't connect to the server." }] };
            setMessages(prev => [...prev, errorResponse]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="chatbot-container">
            <div className="chatbot-header d-flex align-items-center">
                <Bot className="me-2" /> AI Assistant
            </div>
            <div className="chatbot-messages">
                {messages.map((msg, index) => (
                    // UPDATED: This structure now includes wrappers and icons
                    <div key={index} className={`message-wrapper ${msg.role === 'user' ? 'user' : 'bot'}`}>
                        {msg.role === 'user' ? 
                            <User className="chat-icon" size={24} /> : 
                            <Bot className="chat-icon" size={24} />
                        }
                        <div className="chat-bubble">
                            {msg.parts[0].text}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="message-wrapper bot">
                        <Bot className="chat-icon" size={24} />
                        <div className="chat-bubble">
                            <Spinner animation="grow" size="sm" />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <div className="chatbot-input">
                <InputGroup>
                    <Form.Control
                        placeholder="Ask a question..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        disabled={isLoading}
                    />
                    <Button variant="outline-secondary" onClick={handleSend} disabled={isLoading}>
                        <Send size={20} />
                    </Button>
                </InputGroup>
            </div>
        </div>
    );
};

export default Chatbot;
