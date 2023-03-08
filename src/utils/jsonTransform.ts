import { User } from '../types';

export const convertUserDate = (user: User) => {
    return { ...user, joinedAt: new Date(user.joinedAt) } as User;
};
