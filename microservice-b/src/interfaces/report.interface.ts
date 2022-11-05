import { Document } from 'mongoose';

export interface Report extends Document {
  readonly employeeID: string;
  readonly entryTime: Date;
  readonly exitTime: Date;
}
