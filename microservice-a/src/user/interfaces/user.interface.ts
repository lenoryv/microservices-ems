import { Document } from 'mongoose';

export interface User extends Document {
  readonly name: string;
  readonly rol: string;
  readonly username: string;
  readonly password: string;
  readonly age: number;
}
