import { useEffect, useState } from 'react';
import type { Room } from '../types';
import api from '../services/api';

interface RoomListProps {
  onSelectRoom: (id: number) => void;
  activeRoomId: number | null; 
}

export const RoomList = ({ onSelectRoom, activeRoomId }: RoomListProps) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [newRoomName, setNewRoomName] = useState('');

  useEffect(() => {
    api.get<Room[]>('/rooms')
      .then(response => {
        setRooms(response.data);
      })
      .catch(error => {
        console.error("Falha ao buscar salas:", error);
      });
  }, []);

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomName.trim()) return;

    try {
      const response = await api.post<Room>('/rooms', { room: { name: newRoomName } });
      
      setRooms(currentRooms => [...currentRooms, response.data]);
      
      setNewRoomName('');
    } catch (error) {
      console.error("Falha ao criar sala", error);
      alert('Não foi possível criar a sala. Verifique se o nome já existe.');
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        <ul className="p-2">
          {rooms.map(room => (
            <li
              key={room.id}
              onClick={() => onSelectRoom(room.id)}
              className={`p-2 rounded-md cursor-pointer hover:bg-gray-700 ${
                activeRoomId === room.id ? 'bg-indigo-600' : ''
              }`}
            >
              # {room.name}
            </li>
          ))}
        </ul>
      </div>
      <div className="p-4 border-t border-gray-700">
        <form onSubmit={handleCreateRoom} className="flex items-center gap-2">
          <input
            type="text"
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
            placeholder="Criar nova sala..."
            className="flex-1 w-full bg-gray-900 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Nome da nova sala"
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white font-semibold py-2 px-3 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-400 disabled:cursor-not-allowed"
            disabled={!newRoomName.trim()}
            aria-label="Criar sala"
          >
            Criar
          </button>
        </form>
      </div>
    </div>
  );
};