import { Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';

export type UserToken = string;

export type UserMessage = {
  from: UserToken;
  to: UserToken;
  message: string;
  timestamp: number;
}

export type Contact = {
  token: UserToken;
  userName: string;
}

export interface IUser {
  getName(): string;
  getToken(): UserToken;
  getSocket(): Socket;
  getMessages(): Map<UserToken, UserMessage[]>;
  addMessage(userMessage: UserMessage): void;
}

  
export default class User implements IUser {
  private name: string;
  private socket: Socket;
  private token: UserToken;
  private messages: Map<UserToken, UserMessage[]>;

  constructor(userName: string, socket: Socket) {
    this.name = userName;
    this.socket = socket;
    this.token = uuidv4();
    this.messages = new Map<UserToken, UserMessage[]>();
  }

  getToken() {
    return this.token;
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
}