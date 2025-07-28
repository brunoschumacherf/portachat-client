import { useState } from 'react';
import api from '../services/api';

interface MessageInputProps {
  roomId: number;
}

export const MessageInput = ({ roomId }: MessageInputProps) => {
  const [content, setContent] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      await api.post(`/rooms/${roomId}/messages`, { message: { content } });
      setContent('');
    } catch (error) {
      console.error("Falha ao enviar mensagem", error);
    }
  };

  return (
    <footer className="p-4 bg-white border-t">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Digite sua mensagem..."
          className="flex-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-300"
          disabled={!content.trim()}
        >
          Enviar
        </button>
      </form>
    </footer>
  );
};