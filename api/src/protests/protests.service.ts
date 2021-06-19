import { findUserById } from '../users/users.statics';
import {
  addProtest,
  AddProtestInput,
  getProtestByShareToken,
  getProtestsForUser,
} from './protests.statics';
import { ObjectId } from 'mongodb';

export class ProtestsService {
  async addProtest({
    userId,
    title,
    description,
    startDate,
    duration,
  }: AddProtestInput) {
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
      duration,
    };

    const newProtestResult = await addProtest(newProtest);

    const protestId = newProtestResult?.get('_id');

    if (!protestId) {
      return {
        status: false,
        message: 'Failed to create the protest.',
      };
    }

    const newItem = {
      _id: protestId,
    };

    return newItem;
  }
}

export enum AccessLevels {
  Admin = -1,
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
  users: UserDetail[][];
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
