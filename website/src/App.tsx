import React, { useEffect } from 'react';
import { io } from "socket.io-client";
import { Grid, List, ListItem, ListItemButton } from '@mui/material';


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
        <Grid container spacing="12">
          <Grid item xs={12}>Welcome {username}</Grid>
          <Grid item xs={Object.values(contacts).length ? 4 : 12}>
          {
            Object.values(contacts).length
            ?
            <>
            <h3>Contacts</h3>
            <List>
            {
              Object.values(contacts).map(contact => (
                <ListItem disablePadding sx={{borderBottom: 1, borderColor: "lightgray"}} onClick={() => setSelectedContactId(contact.userId)}>
                  <ListItemButton>
                    {contact.userName}
                  </ListItemButton>
                </ListItem>
              ))
            }
            </List>
            </>
            :
            <Grid item xs={12}>
              <p>
                No contacts found.  <a href="http://localhost:3001/" target="_blank"> Click here to open another tab and get this party started!</a>
              </p>
            </Grid>
          }
          </Grid>
          <Grid item xs={8}>
          {
            selectedContact &&
            <>
            <h4>Chatting with {selectedContact.userName}</h4>
            {
              selectedContact.messages.length
              ?
              <List>
              {
                selectedContact.messages.map(({from, message, timestamp}) => (
                  <ListItem
                    sx={{
                      backgroundColor: from === userId ? 'palegreen' : 'paleturquoise',
                      borderRadius: 2,
                      my: 2
                    }} >
                    {`${timestamp} - ${message}`}
                  </ListItem>
                ))
              }
              </List>
              :
              <div>"No Messages - Why not start the conversation?"</div>
            }
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
            </>
          }
          </Grid>
        </Grid>
      }
    </div>
  );
}

export default App;
