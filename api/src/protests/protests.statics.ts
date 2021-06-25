import Protest from './protests.models';
import { ObjectId } from 'mongodb';
import { AccessLevels } from './protests.service';

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
        duration,
        associatedUsers: [
          {
            _id: new ObjectId(userId),
            accessLevel: AccessLevels.Leader,
            isCreator: true,
          },
        ],
      },
    },
    { upsert: true, new: true }
  );

export const getProtestByShareToken = async (token: string) =>
  await Protest.aggregate([
    {
      $match: { 'shareToken.token': token },
    },
    {
      $project: {
        _id: 1,
        title: 1,
        description: 1,
        startDate: 1,
        duration: 1,
      },
    },
  ]);

export const getProtestsForUser = async (userId: string) =>
  await Protest.aggregate([
    {
      $match: { 'associatedUsers._id': new ObjectId(userId) },
    },
    {
      $sort: { startDate: -1 },
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
