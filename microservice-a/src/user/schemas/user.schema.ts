import { Schema } from 'mongoose';

export const UserSchema = new Schema(
  {
    name: String,
    rol: String,
    username: String,
    password: String,
    age: Number,
  },
  { versionKey: false },
);

UserSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});
