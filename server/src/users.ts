
import { IUser } from './User';
import { Contact, UserId } from './sharedTypes';

const db: Map<UserId, IUser> = new Map();

export function getContacts() {
  const contacts: {[key: UserId]: Contact} = {};

  db.forEach(user => {
    contacts[user.getUserId()] = user.toContact();
  });

  return contacts;
}

export default db;