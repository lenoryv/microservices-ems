import { Document } from 'mongoose';

export interface User extends Document {
  readonly rol: string;
  readonly username: string;
  readonly password: string;
}
