export interface User {
  id: number;
  name: string;
  email: string;
  access_level: 'member' | 'admin';
  status: 'active' | 'inactive';
}

export interface Room {
  id: number;
  name: string;
}

export interface Message {
  id: number;
  content: string;
  created_at: string;
  user: {
    id: number;
    name: string;
  };
}