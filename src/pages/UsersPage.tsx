import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // 1. Importar o Link para navegação
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import type { User } from '../types';

interface SortConfig {
  key: keyof User;
  direction: 'asc' | 'desc';
}

export const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'name', direction: 'asc' });
  const { user: loggedInUser, logout } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const params = new URLSearchParams({
          'q[s]': `${sortConfig.key} ${sortConfig.direction}`,
          'q[name_or_email_cont]': searchTerm,
        });

        const response = await api.get<User[]>(`/users?${params.toString()}`);
        setUsers(response.data);
      } catch (error) {
        console.error("Falha ao buscar usuários:", error);
      }
    };

    const debounceFetch = setTimeout(() => {
      fetchUsers();
    }, 300);

    return () => clearTimeout(debounceFetch);
  }, [searchTerm, sortConfig]);

  const handleInactivate = async (userIdToInactivate: number) => {
    if (window.confirm('Tem certeza que deseja inativar este usuário?')) {
      try {
        await api.delete(`/users/${userIdToInactivate}`);
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

  const handleSort = (key: keyof User) => {
    setSortConfig(currentConfig => ({
      key,
      direction: currentConfig.key === key && currentConfig.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const isAdmin = loggedInUser?.access_level === 'admin';

  const SortIndicator = ({ columnKey }: { columnKey: keyof User }) => {
    if (sortConfig.key !== columnKey) return null;
    return sortConfig.direction === 'asc' ? ' ▲' : ' ▼';
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto p-4 md:p-6">
        <header className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold text-gray-800">Gerenciamento de Usuários</h1>
          <div className="flex items-center gap-4">
            <Link
              to="/chat"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md transition-colors"
            >
              Ir para Chats
            </Link>
            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition-colors"
            >
              Sair
            </button>
          </div>
        </header>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Buscar por nome ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('name')}>
                  Nome<SortIndicator columnKey="name" />
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('email')}>
                  Email<SortIndicator columnKey="email" />
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                {isAdmin && <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className={user.status === 'inactive' ? 'bg-gray-100 text-gray-500' : 'hover:bg-gray-50'}>
                  <td className="py-4 px-4 whitespace-nowrap">{user.name}</td>
                  <td className="py-4 px-4 whitespace-nowrap">{user.email}</td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {user.status === 'active' ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  {isAdmin && (
                    <td className="py-4 px-4 whitespace-nowrap">
                      {loggedInUser.id !== user.id && user.status === 'active' && (
                        <button
                          onClick={() => handleInactivate(user.id)}
                          className="text-red-600 hover:text-red-900 font-medium transition-colors"
                          aria-label={`Inativar usuário ${user.name}`}
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