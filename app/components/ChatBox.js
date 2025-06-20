'use client';

import { useState, useEffect, useRef } from 'react';

function Message({ text, sender }) {
    if (sender === 'user') {
        return (
            <div className='p-2 text-right'>
                <div className='inline-block px-4 py-2 rounded-lg bg-blue-500 text-white'>
                    {text}
                </div>
            </div>
        )
    }
    else {
        return (
            <div className='p-2 text-left'>
                <div className='inline-block px-4 py-2 rounded-lg bg-gray-500 text-white'>
                    {text}
                </div>
            </div>
        )
    }
}

export default function ChatBox() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    useEffect(()=>{
    },[])
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = () => {
        if (input.trim() === '') return;
        
        // Add user message
        const userMessage = { text: input, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        
        // Simulate AI response after a short delay
        setTimeout(() => {
            fetch('/api/chat', {
                method: 'POST',
                body: JSON.stringify({ message: input }),
            })
            .then(res => res.json())
            .then(data => {
                console.log(data)
                const aiMessage = { text: `(${data.response.emotion}) `+data.response.answer, sender: 'AI' };
                setMessages(prev => [...prev, aiMessage]);
            })
        }, 500);
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    }

    return (
        <div className='flex flex-col w-96 h-96 mx-auto bg-gray-100 rounded-lg shadow-lg'>
            <main className='flex-1 overflow-y-auto'>
                {messages.map((message, index) => (
                    <Message key={index} text={message.text} sender={message.sender} />
                ))}
                <div ref={messagesEndRef} />
            </main>
            <footer className='flex items-center p-2 border-t border-gray-200'>
                <input 
                    type='text' 
                    placeholder='Enter your message' 
                    value={input} 
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className='flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
                <button 
                    onClick={handleSend}
                    className='ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500'
                >
                    Send
                </button>
            </footer>
        </div>
    )
} 