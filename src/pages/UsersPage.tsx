import { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const { user, logout } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/users');
        setUsers(response.data);
      } catch (error) {
        console.error("Failed to fetch users", error);
      }
    };
    fetchUsers();
  }, []);

  const handleDelete = async (userId: number) => {
    if (window.confirm('Tem certeza que deseja inativar este usuário?')) {
      try {
        await api.delete(`/users/${userId}`);
        setUsers(users.filter((u: any) => u.id !== userId));
      } catch (error) {
        alert('Ação não autorizada.');
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Usuários</h1>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">ID</th>
            <th className="py-2 px-4 border-b">Nome</th>
            <th className="py-2 px-4 border-b">Email</th>
            {user?.access_level === 'admin' && <th className="py-2 px-4 border-b">Ações</th>}
          </tr>
        </thead>
        <tbody>
          {users.map((user: any) => (
            <tr key={user.id}>
              <td className="py-2 px-4 border-b">{user.id}</td>
              <td className="py-2 px-4 border-b">{user.name}</td>
              <td className="py-2 px-4 border-b">{user.email}</td>
              {user.access_level === 'admin' && (
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Inativar
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
        <button
            onClick={logout}
            className="mt-4 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
            Sair
        </button>
    </div>
  );
};