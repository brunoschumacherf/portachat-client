// src/pages/UsersPage.tsx
import { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import ActionCable from 'actioncable';

// 1. Definir uma interface para o usuário. Isso é crucial para aproveitar o TypeScript.
interface User {
  id: number;
  name: string;
  email: string;
  access_level: 'member' | 'admin';
  status: 'active' | 'inactive';
}

export const UsersPage = () => {
  // Use a interface User para tipar o estado
  const [users, setUsers] = useState<User[]>([]);
  const { user: loggedInUser, logout } = useAuth(); // Renomear para evitar conflito de nome

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get<User[]>('/users'); // Tipar a resposta da API
        setUsers(response.data);
      } catch (error) {
        console.error("Failed to fetch users", error);
        // Considere notificar o usuário sobre a falha, talvez com um toast.
      }
    };
    fetchUsers();

    const cable = ActionCable.createConsumer('ws://localhost:3000/cable');
    const subscription = cable.subscriptions.create('UsersChannel', {
      received: (data: { type: string; payload: User }) => {
        if (data.type === 'NEW_USER') {
          setUsers(currentUsers => {
            // 4. Prevenir a adição de usuários duplicados (caso a notificação chegue antes do fetch terminar)
            if (currentUsers.some(u => u.id === data.payload.id)) {
              return currentUsers;
            }
            return [data.payload, ...currentUsers];
          });
        }
      },
    });

    return () => {
      subscription.unsubscribe();
      cable.disconnect();
    };
  }, []); // O array de dependências vazio está correto aqui.

  const handleInactivate = async (userIdToInactivate: number) => {
    if (window.confirm('Tem certeza que deseja inativar este usuário?')) {
      try {
        await api.delete(`/users/${userIdToInactivate}`);
        // 3. Atualizar o estado em vez de remover, para refletir a inativação
        setUsers(currentUsers =>
          currentUsers.map(u =>
            u.id === userIdToInactivate ? { ...u, status: 'inactive' } : u
          )
        );
      } catch (error) {
        alert('Ação não autorizada ou falha na operação.');
      }
    }
  };

  const isAdmin = loggedInUser?.access_level === 'admin';

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto p-6">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Gerenciamento de Usuários</h1>
          <button
            onClick={logout}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md transition-colors"
          >
            Sair
          </button>
        </header>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                {isAdmin && <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                // 5. Adicionar estilo para usuários inativos
                <tr key={user.id} className={user.status === 'inactive' ? 'bg-gray-100 text-gray-400' : ''}>
                  <td className="py-4 px-4 whitespace-nowrap">{user.name}</td>
                  <td className="py-4 px-4 whitespace-nowrap">{user.email}</td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {user.status === 'active' ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  {/* 2. A lógica de autorização deve usar o usuário LOGADO (isAdmin) */}
                  {isAdmin && (
                    <td className="py-4 px-4 whitespace-nowrap">
                      {/* Impede que o admin se auto-inactive */}
                      {loggedInUser.id !== user.id && user.status === 'active' && (
                        <button
                          onClick={() => handleInactivate(user.id)}
                          className="text-red-600 hover:text-red-900 font-medium transition-colors"
                        >
                          Inativar
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};