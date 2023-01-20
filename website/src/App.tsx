import React from 'react';
import './App.css';
import { io } from "socket.io-client";

const socket = io();

type UserToken = string;
type Contact = {
  token: UserToken;
  userName: string;
}

function App() {
  
  const [userToken, setUserToken] = React.useState('');
  const [nameInput, setNameInput] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [contacts, setContacts] = React.useState<Contact[]>([]);

  socket.on('users:toClient', (contacts: Contact[]) => {
    console.log(`contacts: ${JSON.stringify(contacts, null, 2)}`)
    const otherContacts = contacts.filter(contact => contact.token !== userToken)
    setContacts(otherContacts);
  });

  type NewUserResponse = {
    token: string;
    contacts: Contact[];
  }

  return (
    <div className="App">
      <header className="App-header">        
          {
            !username 
            ?
            <form>
              <label htmlFor="name-input">Welcome To Toucan Party Chat, What Is Your Name?</label>
              <input type="text" name="name-input" id="name-input" value={nameInput} onChange={e => setNameInput(e.target.value)}/>
              <button onClick={(e) => {
                e.preventDefault();
                setUsername(nameInput);
                socket.emit('user:new', nameInput, (response: NewUserResponse) => {
                  localStorage.setItem('partychat:userId', response.token);
                  setUserToken(response.token);
                  setContacts(response.contacts);
                });
              }}>Save</button>
            </form>
            :
            <div>
              `Welcome {username}`
              <section>
                {
                  contacts.length
                  ?
                  contacts.map(contact => <div>{contact.userName}</div>) 
                  :
                  (<div>No contacts found :(</div>)
                }
              </section>
            </div>
          }
      </header>
    </div>
  );
}

export default App;
