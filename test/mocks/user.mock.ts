import { User } from '../../src/modules/users/user.schema';

export const mockUserFactory = (opts?: Partial<Omit<User, 'password'>>): User =>
  ({
    id: opts?.id || 'mock-user-id',
    email: opts?.email || 'test@notes.com',
    createdAt: opts?.createdAt || new Date(),
  }) as User;
