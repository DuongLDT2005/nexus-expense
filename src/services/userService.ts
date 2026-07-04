import { nanoid } from 'nanoid';
import { request } from './apiHelper';

export interface UserData {
  id: string;
  fullName: string;
  email: string;
}

export const createUser = async (
  fullName: string,
  email: string,
): Promise<string> => {
  const id = nanoid(24);
  await request<UserData>('/users', {
    method: 'POST',
    body: JSON.stringify({
      id,
      fullName,
      email: email || 'null',
    }),
  });
  return id;
};

export const updateUserById = async (
  userId: string,
  updates: { fullName?: string; email?: string; currencyId?: string; theme?: string },
): Promise<void> => {
  await request<UserData>(`/users/${userId}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  });
};

export const getUserById = async (
  userId: string,
): Promise<{ id: string; fullName: string; email: string } | null> => {
  try {
    const user = await request<UserData>(`/users/${userId}`);
    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
    };
  } catch {
    return null;
  }
};

export const getAllUsers = async (): Promise<
  { id: string; fullName: string; email: string }[]
> => {
  try {
    const users = await request<UserData[]>('/users');
    return users.map(u => ({
      id: u.id,
      fullName: u.fullName,
      email: u.email,
    }));
  } catch {
    return [];
  }
};
