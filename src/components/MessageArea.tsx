import { useEffect, useState, useRef } from 'react';
import type { Message } from '../types';
import api from '../services/api';
import ActionCable from 'actioncable';
import { MessageInput } from '../pages/MessageInput';

interface MessageAreaProps {
  roomId: number;
}

export const MessageArea = ({ roomId }: MessageAreaProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!roomId) return;
    api.get<Message[]>(`/rooms/${roomId}/messages`).then(response => {
      setMessages(response.data);
    });
    const cable = ActionCable.createConsumer('ws://localhost:3000/cable');
    const subscription = cable.subscriptions.create(
      { channel: 'RoomChannel', id: roomId },
      {
        received: (newMessage: Message) => {
          setMessages(currentMessages => [...currentMessages, newMessage]);
        },
      }
    );
    return () => {
      subscription.unsubscribe();
      cable.disconnect();
    };
  }, [roomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col bg-gray-200">
      <header className="p-4 border-b bg-white shadow-sm">
        <h2 className="text-xl font-bold text-gray-800">Mensagens</h2>
      </header>
      <main className="flex-1 p-4 overflow-y-auto">
        {messages.map(msg => (
          <div key={msg.id} className="mb-4">
            <p className="font-bold text-gray-900">{msg.user.name}</p>
            <p className="text-gray-700">{msg.content}</p>
            <span className="text-xs text-gray-500">
              {new Date(msg.created_at).toLocaleTimeString()}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </main>
      <MessageInput roomId={roomId} />
    </div>
  );
};