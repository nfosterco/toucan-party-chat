
import { IUser } from './User';
import { Contact, UserToken } from '../../sharedTypes';

const db: Map<UserToken, IUser> = new Map();

export function getContacts() {
  const contacts: Contact[] = [];

  db.forEach(contact => {
    contacts.push({
      token: contact.getToken(),
      userName: contact.getName()
    });
  });

  return contacts;
}

export default db;