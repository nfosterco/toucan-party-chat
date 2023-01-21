import React, { useEffect } from 'react';
import { io } from "socket.io-client";

import './App.css';
import { Contact, NewUserResponse, UserMessage, UserId } from './sharedTypes';
import SingleTextInput from './SingleTextInput';

const socket = io();

function App() {
  const [userId, setUserId] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [contacts, setContacts] = React.useState<{[key: UserId]: Contact}>({});
  const [selectedContactId, setSelectedContactId] = React.useState<UserId | null>(null);

  const selectedContact = selectedContactId && contacts[selectedContactId];

  useEffect(() => {
    function handleNewUser(newContact: Contact) {
      setContacts({ ...contacts, [newContact.userId]: newContact })
    }

    function handleNewMessage(userMessage: UserMessage) {
      setContacts({
        ...contacts,
        [userMessage.from]: {
          ...contacts[userMessage.from],
          messages: [...contacts[userMessage.from].messages, userMessage]
        }
      });
    }

    socket.on('user:newToUser', handleNewUser);
    socket.on('message:newToUser', handleNewMessage);

    return () => {
      socket.off("user:newToUser", handleNewUser);
      socket.off("message:newToUser", handleNewMessage);
    };
  }, [contacts, selectedContactId]);

  return (
    <div className="App">
      <header className="App-header">        
      {
        !userId
        ?
        <SingleTextInput
          labelText="Welcome To Toucan Party Chat, What Is Your Name?"
          buttonText="Save"
          action={(input: string) => {
              setUsername(input);
              socket.emit('user:new', input, ({ userId, contacts }: NewUserResponse) => {
                localStorage.setItem('partychat:userId', userId);
                setUserId(userId);
                setContacts(contacts);
              });
            }
          }
        />
        :
        <div>
          Welcome {username}
          <section>
          {
            Object.values(contacts).length
            ?
            <>
            <h3>Contacts</h3>
            <ul>
            {
              Object.values(contacts).map(contact => (
                <li onClick={() => setSelectedContactId(contact.userId)}>
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
            selectedContact &&
            <>
            <h4>Chatting with {selectedContact.userName}</h4>
            <SingleTextInput
              labelText=""
              buttonText="Send"
              action={
                (message: string) => {
                  const userMessage: UserMessage = {
                    from: userId,
                    to: selectedContact.userId,
                    message,
                    timestamp: Date.now()
                  }

                  setContacts({
                    ...contacts,
                    [selectedContact.userId]: {
                      ...contacts[selectedContact.userId],
                      messages: [
                        ...contacts[selectedContact.userId].messages,
                        userMessage
                      ]
                    }
                  })

                  socket.emit('message:new', userMessage);
                }
              }
            />
            {
              selectedContact.messages.length &&
              <ul>
              {
                selectedContact.messages.map(({message, timestamp}) => (
                  <li>{`${timestamp} - ${message}`}</li>
                ))
              }
              </ul>
            }
            </>
          }
          </section>
        </div>
      }
      </header>
    </div>
  );
}

export default App;
