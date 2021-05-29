import Protest from './protests.models';
import { ObjectId } from 'mongodb';
import { AssociatedProtest, UserDetail } from './protests.service';

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

export const getProtestsForUser = async (userId: string) => {
  const userObjectId = new ObjectId(userId);

  const aggregate = await Protest.aggregate([
    {
      $match: {
        $expr: { $in: [userObjectId, '$associatedUserIds'] },
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'associatedUserIds',
        foreignField: '_id',
        as: 'user_info',
      },
    },
    {
      $group: {
        _id: new ObjectId(),
        protests: {
          $push: {
            _id: '$_id',
            title: '$title',
            description: '$description',
            startDate: '$startDate',
            users: '$user_info.associatedProtests',
          },
        },
      },
    },
    {
      $project: {
        protests: '$protests',
      },
    },
  ]);

  const mapped = aggregate[0].protests.map((protest: AssociatedProtest) => {
    const { _id, title, description, startDate } = protest;

    const filtered = protest.users[0].filter((userProtest: UserDetail) =>
      userProtest.protestId.equals(_id)
    );

    return {
      _id,
      title,
      description,
      startDate,
      users: filtered,
    };
  });

  return mapped;
};

export interface AddProtestInput {
  title: string;
  startDate: Date;
  description: string;
  userId: string;
}
