import { Schema } from 'mongoose';

export const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    rol: {
      type: String,
      required: true,
    },
    username: String,
    password: String,
    age: {
      type: String,
      required: true,
    },
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
