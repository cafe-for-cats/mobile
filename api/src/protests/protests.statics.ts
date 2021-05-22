import Protest from './protests.models';
import { ObjectId } from 'mongodb';

export const addProtest = async ({
  title,
  startDate,
  description,
  userId,
}: AddProtestInput) =>
  await Protest.findOneAndUpdate(
    { _id: new ObjectId() },
    {
      $set: {
        title,
        startDate,
        description,
        associatedUserIds: [new ObjectId(userId)],
      },
    },
    { upsert: true, new: true }
  );

export interface AddProtestInput {
  title: string;
  startDate: Date;
  description: string;
  userId: string;
}
