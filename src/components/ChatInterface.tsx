import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic } from 'lucide-react';
import { useCoachingStore } from '../store/useCoachingStore';

export const ChatInterface: React.FC = () => {
  const [message, setMessage] = useState('');
  const { chatHistory, addChatMessage } = useCoachingStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    addChatMessage({
      content: message,
      sender: 'user',
    });
    setMessage('');

    // Simulate AI response
    setTimeout(() => {
      addChatMessage({
        content: "I understand how you're feeling. Would you like to explore what's behind these emotions?",
        sender: 'ai',
      });
    }, 1000);
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-md flex flex-col h-[500px]">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatHistory.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                msg.sender === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <button
            type="button"
            className="p-2 text-gray-500 hover:text-gray-700"
            aria-label="Voice Input"
          >
            <Mic size={20} />
          </button>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Type your message..."
          />
          <button
            type="submit"
            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  );
};