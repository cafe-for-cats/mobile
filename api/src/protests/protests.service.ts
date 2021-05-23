import {
  findUserById,
  updateUsersAssociatedProtests,
} from '../users/users.statics';
import {
  addProtest,
  AddProtestInput,
  getProtestsForUser,
} from './protests.statics';
import { ObjectId } from 'mongodb';

export class ProtestsService {
  async addProtest({ userId, title, description, startDate }: AddProtestInput) {
    const user = await findUserById(userId);

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

  async getProtestsForUser(userId: string) {
    const mapped = await getProtestsForUser(userId);

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

export interface ProtestAggregate {
  _id: ObjectId;
  protests: AssociatedProtest[];
}

export interface AssociatedProtest {
  _id: ObjectId;
  title: string;
  description: string;
  startDate: Date;
  usersAssociatedProtests: UserDetail[][];
}

export interface UserDetail {
  _id: ObjectId;
  protestId: ObjectId;
  accessLevel: string;
  isCreator: boolean;
}

// -- may want to be able to filter protests by ones that have not happened yet
// -- pull down all protests by ones i've created

// -- separate the "who are you" from the "what you have access to"

// -- how to compsenate for leadership of a protest changing hands
