export type UserId = string;

export type UserMessage = {
  from: UserId;
  to: UserId;
  message: string;
  timestamp: number;
}

export type Contact = {
  userId: UserId;
  userName: string;
  messages: UserMessage[]
}

export type NewUserResponse = {
  userId: string;
  contacts: {[key: UserId]: Contact};
}