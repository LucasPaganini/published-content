import { findUserById } from './find-user-by-id.js';

export const showUserName = userId => {
	const userName = findUserById(userId).name;
	return userName;
};
