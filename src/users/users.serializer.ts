export interface UsersSerializerInput {
  id: string;
  username: string;
  email: string;
}

export class UsersSerializer {
  id: string;
  username: string;
  email: string;

  constructor({ id, username, email }: UsersSerializerInput) {
    this.id = id;
    this.username = username;
    this.email = email;
  }
}
