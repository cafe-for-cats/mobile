import {
  findUserById,
  updateUsersAssociatedProtests,
} from '../users/users.statics';
import { addProtest, AddProtestInput } from './protests.statics';

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
}
