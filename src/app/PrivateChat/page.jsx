"use client"
import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

const Chat = () => {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [isJoined, setIsJoined] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    socket.on('message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on('userJoined', (user) => {
      setMessages((prev) => [...prev, { 
        text: `${user} joined the chat`,
        type: 'system'
      }]);
    });

    socket.on('userLeft', (user) => {
      setMessages((prev) => [...prev, { 
        text: `${user} left the chat`,
        type: 'system'
      }]);
    });

    socket.on('userList', (userList) => {
      setUsers(userList);
    });

    return () => {
      socket.off('message');
      socket.off('userJoined');
      socket.off('userLeft');
      socket.off('userList');
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleJoin = (e) => {
    e.preventDefault();
    if (username.trim()) {
      socket.emit('join', username);
      setIsJoined(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit('message', message);
      setMessage('');
    }
  };

  if (!isJoined) {
    return (
      <div className="flex h-screen items-center justify-center bg-black">
        <div className="w-96 bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Join Chat</h2>
            <form onSubmit={handleJoin} className="space-y-4">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
              >
                Join
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-black">
      <div className="m-4 flex w-full max-w-4xl flex-1">
        <div className="flex w-full flex-col bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-2xl font-bold text-gray-800">Chat Room</h2>
          </div>
          
          <div className="flex flex-1 overflow-hidden">
            <div className="flex-1 flex flex-col">
              <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`${
                      msg.type === 'system'
                        ? 'text-center text-gray-500 italic'
                        : msg.username === username
                        ? 'ml-auto'
                        : ''
                    } max-w-[70%]`}
                  >
                    {msg.type !== 'system' && (
                      <div
                        className={`rounded-lg p-3 ${
                          msg.username === username
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200'
                        }`}
                      >
                        <div className="text-sm font-bold">
                          {msg.username === username ? 'You' : msg.username}
                        </div>
                        <div>{msg.text}</div>
                      </div>
                    )}
                    {msg.type === 'system' && <div>{msg.text}</div>}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              
              <div className="p-4 border-t">
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 rounded border border-gray-300 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition duration-200"
                  >
                    Send
                  </button>
                </form>
              </div>
            </div>
            
            <div className="w-48 border-l bg-gray-50">
              <div className="p-4">
                <div className="font-bold mb-2 text-gray-700">
                  Online Users ({users.length})
                </div>
                <div className="space-y-2">
                  {users.map((user, index) => (
                    <div key={index} className="text-sm text-gray-600">
                      {user}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Chat;