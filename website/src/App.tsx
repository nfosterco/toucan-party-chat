import React, { useEffect } from 'react';
import { io } from "socket.io-client";

import './App.css';
import { Contact, NewUserResponse, UserMessage, UserId } from './sharedTypes';

const socket = io();

function App() {
  
  const [userId, setUserId] = React.useState('');
  const [nameInput, setNameInput] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [contacts, setContacts] = React.useState<{[key: UserId]: Contact}>({});
  const [activeContact, setActiveContact] = React.useState<Contact | null>(null);

  useEffect(() => {
    socket.on('user:new', (newContact: Contact) => setContacts({ ...contacts, newContact }));
  }, []);

  return (
    <div className="App">
      <header className="App-header">        
          {
            !userId
            ?
            <form>
              <label htmlFor="name-input">Welcome To Toucan Party Chat, What Is Your Name?</label>
              <input type="text" name="name-input" id="name-input" value={nameInput} onChange={e => setNameInput(e.target.value)}/>
              <button onClick={(e) => {
                e.preventDefault();
                setUsername(nameInput);
                socket.emit('user:new', nameInput, ({userId, contacts}: NewUserResponse) => {
                  localStorage.setItem('partychat:userId', userId);
                  setUserId(userId);
                  setContacts(contacts);
                });
              }}>Save</button>
            </form>
            :
            <div>
              `Welcome {username}`
              <section>
                {
                  Object.values(contacts).length
                  ?
                  Object.values(contacts).map((contact) => (
                    <div onClick={() => setActiveContact(contact)}>
                      {contact.userName}
                    </div>
                  ))
                  :
                  (<div>No contacts found :(</div>)
                }
              </section>
              <section>
                {
                  activeContact &&  `Chatting with ${activeContact.userName}`
                }
              </section>
            </div>
          }
      </header>
    </div>
  );
}

export default App;
