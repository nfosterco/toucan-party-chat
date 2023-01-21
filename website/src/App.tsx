import React, { useEffect } from 'react';
import { io } from "socket.io-client";

import './App.css';
import { Contact, NewUserResponse, UserMessage, UserId } from './sharedTypes';
import SingleTextInput from './SingleTextInput';

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
            <SingleTextInput
              labelText="Welcome To Toucan Party Chat, What Is Your Name?"
              buttonText="Save"
              action={
                (input: string) => {
                  setUsername(input);
                  socket.emit('user:new', nameInput, ({userId, contacts}: NewUserResponse) => {
                    localStorage.setItem('partychat:userId', userId);
                    setUserId(userId);
                    setContacts(contacts);
                  });
                }
              }
            />
            :
            <div>
              `Welcome {username}`
              <section>
                {
                  Object.values(contacts).length
                  ?
                  <>
                  <h3>Contacts</h3>
                  <ul>
                  {
                    Object.values(contacts).map(contact => (
                      <li onClick={() => setActiveContact(contact)}>
                        {contact.userName}
                      </li>
                    ))
                  }
                  </ul>
                  </>
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
