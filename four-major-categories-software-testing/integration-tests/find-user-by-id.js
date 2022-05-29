import { USERS } from './users.js';

export const findUserById = id => {
	return USERS.find(user => user.id === id);
};
