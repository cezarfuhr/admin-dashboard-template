import { User, UserResponse } from '../types';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

// In-memory database (in production, use a real database)
let users: User[] = [
  {
    id: uuidv4(),
    name: 'Admin User',
    email: 'admin@example.com',
    password: bcrypt.hashSync('admin123', 10),
    role: 'admin',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuidv4(),
    name: 'John Doe',
    email: 'john@example.com',
    password: bcrypt.hashSync('user123', 10),
    role: 'user',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export class UserModel {
  static async findAll(): Promise<UserResponse[]> {
    return users.map(({ password, ...user }) => user);
  }

  static async findById(id: string): Promise<UserResponse | null> {
    const user = users.find(u => u.id === id);
    if (!user) return null;
    const { password, ...userResponse } = user;
    return userResponse;
  }

  static async findByEmail(email: string): Promise<User | null> {
    return users.find(u => u.email === email) || null;
  }

  static async create(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<UserResponse> {
    const newUser: User = {
      ...userData,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    users.push(newUser);
    const { password, ...userResponse } = newUser;
    return userResponse;
  }

  static async update(id: string, userData: Partial<User>): Promise<UserResponse | null> {
    const index = users.findIndex(u => u.id === id);
    if (index === -1) return null;

    users[index] = {
      ...users[index],
      ...userData,
      updatedAt: new Date(),
    };

    const { password, ...userResponse } = users[index];
    return userResponse;
  }

  static async delete(id: string): Promise<boolean> {
    const index = users.findIndex(u => u.id === id);
    if (index === -1) return false;
    users.splice(index, 1);
    return true;
  }

  static async verifyPassword(email: string, password: string): Promise<User | null> {
    const user = await this.findByEmail(email);
    if (!user) return null;

    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? user : null;
  }
}
