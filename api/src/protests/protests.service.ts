import {
  findUserById,
  updateUsersAssociatedProtests,
} from '../users/users.statics';
import { addProtest, AddProtestInput } from './protests.statics';
import { ObjectId } from 'mongodb';
import Protest from './protests.models';

export class ProtestsService {
  async addProtest(
    title: string,
    description: string,
    startDate: Date,
    creatorId: string
  ) {
    const user = await findUserById(creatorId);

    if (!user) {
      return {
        status: false,
        message: 'No user',
      };
    }

    const userObjectId = user?.get('_id');

    const newProtest: AddProtestInput = {
      userId: userObjectId,
      title,
      description,
      startDate,
    };

    const newProtestResult = await addProtest(newProtest);

    const protestId = newProtestResult?.get('_id');

    if (!protestId) {
      return {
        status: false,
        message: 'Failed to create the protest.',
      };
    }

    const userInput = {
      userId: userObjectId,
      protestId,
    };

    const updatedUser = await updateUsersAssociatedProtests(userInput);

    if (!updatedUser) {
      return {
        status: false,
        message: 'Failed to associated user to the protest.',
      };
    }

    return {
      status: true,
      message: 'Added protest.',
      payload: { protest: newProtestResult },
    };
  }

  async getProtestsForUser(input: any) {
    const userId = new ObjectId(input.creatorId);

    const aggregate: ProtestAggregate[] = await Protest.aggregate([
      {
        $match: {
          $expr: { $in: [userId, '$associatedUserIds'] },
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
              usersAssociatedProtests: '$user_info.associatedProtests',
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

      const filtered = protest.usersAssociatedProtests[0].filter(
        (userProtest: UserDetail) => userProtest.protestId.equals(_id)
      );

      return {
        _id,
        title,
        description,
        startDate,
        usersAssociatedProtests: filtered,
      };
    });

    return {
      status: true,
      message: 'Success',
      payload: { usersAssociatedProtests: mapped },
    };
  }
}

export enum AccessLevels {
  Admin = 0,
  Leader = 1,
  Organizer = 2,
  Attendee = 3,
  Unassigned = 4,
}

interface ProtestAggregate {
  _id: ObjectId;
  protests: AssociatedProtest[];
}

interface AssociatedProtest {
  _id: ObjectId;
  title: string;
  description: string;
  startDate: Date;
  usersAssociatedProtests: UserDetail[][];
}

interface UserDetail {
  _id: ObjectId;
  protestId: ObjectId;
  accessLevel: string;
  isCreator: boolean;
}
