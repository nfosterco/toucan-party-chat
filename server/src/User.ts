import { Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { UserId, UserMessage, Contact } from './sharedTypes'

export interface IUser {
  getName(): string;
  getUserId(): UserId;
  getSocket(): Socket;
  getMessages(): Map<UserId, UserMessage[]>;
  toContact(): Contact;
  addMessage(userMessage: UserMessage): void;
}

  
export default class User implements IUser {
  private name: string;
  private socket: Socket;
  private userId: UserId;
  private messages: Map<UserId, UserMessage[]>;

  constructor(userName: string, socket: Socket) {
    this.name = userName;
    this.socket = socket;
    this.userId = uuidv4();
    this.messages = new Map<UserId, UserMessage[]>();
  }

  getUserId() {
    return this.userId;
  }

  getSocket() {
    return this.socket;
  }

  getName() {
    return this.name;
  }

  getMessages(): Map<string, UserMessage[]> {
    return this.messages;
  }

  addMessage(userMessage: UserMessage) {
    const currentMessages = this.messages.get(userMessage.from);

    if (currentMessages) {
      currentMessages.push(userMessage);

    } else {
      this.messages.set(userMessage.from, [userMessage]);
    }

    return userMessage;
  }

  toContact(): Contact {
    const { userId, name } = this;
    return {
      userId,
      userName: name,
      messages: []
    }
  }
}