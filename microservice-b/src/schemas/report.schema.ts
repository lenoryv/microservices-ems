import { Schema } from 'mongoose';

export const ReportSchema = new Schema(
  {
    employeeID: {
      type: String,
      required: true,
    },
    entryTime: {
      type: Date,
      required: true,
    },
    exitTime: {
      type: Date,
      required: true,
    },
  },
  { versionKey: false },
);

ReportSchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});
