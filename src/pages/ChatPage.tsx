import { useState } from 'react';
import { RoomList } from '../components/RoomList';
import { MessageArea } from '../components/MessageArea';
import { useAuth } from '../contexts/AuthContext';

export const ChatPage = () => {
  const [activeRoomId, setActiveRoomId] = useState<number | null>(null);
  const { logout } = useAuth();

  return (
    <div className="h-screen w-full flex bg-gray-100 font-sans">
      <div className="w-1/4 bg-gray-800 text-white flex flex-col">
        <header className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h1 className="text-xl font-bold">Salas de Chat</h1>
          <button
            onClick={logout}
            className="text-sm bg-red-600 hover:bg-red-700 rounded px-2 py-1"
          >
            Sair
          </button>
        </header>
        <RoomList onSelectRoom={setActiveRoomId} activeRoomId={null} />
      </div>

      <div className="w-3/4 flex flex-col">
        {activeRoomId ? (
          <MessageArea roomId={activeRoomId} />
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <p>Selecione uma sala para começar a conversar.</p>
          </div>
        )}
      </div>
    </div>
  );
};