import Protest from './protests.models';
import { ObjectId } from 'mongodb';

export const addProtest = async ({
  title,
  startDate,
  description,
  userId,
  duration,
}: AddProtestInput) =>
  await Protest.findOneAndUpdate(
    { _id: new ObjectId() },
    {
      $set: {
        title,
        startDate,
        description,
        duration: 120, // duration in minutes
        associatedUsers: [{ _id: new ObjectId(userId), accessLevel: 1 }],
      },
    },
    { upsert: true, new: true }
  );

export const getProtestsForUser = async (userId: string) =>
  await Protest.aggregate([
    {
      $match: { 'associatedUsers._id': new ObjectId(userId) },
    },
    {
      $project: {
        _id: 1,
        title: 1,
        description: 1,
        startDate: 1,
        duration: 1,
        associatedUsers: {
          $filter: {
            input: '$associatedUsers',
            as: 'associatedUser',
            cond: {
              $eq: ['$$associatedUser._id', new ObjectId(userId)],
            },
          },
        },
      },
    },
  ]);

export interface AddProtestInput {
  title: string;
  startDate: Date;
  description: string;
  userId: string;
  duration: number;
}
