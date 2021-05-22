import * as socketio from 'socket.io';
import { CommonSocketsConfig } from '../common/common.sockets.config';
import { ObjectId } from 'mongodb';
import User from '../users/users.models';
import Protest from './protests.models';
import {
  findUserById,
  updateUsersAssociatedProtests,
} from '../users/users.statics';
import { addProtest, AddProtestInput } from './protests.statics';
import { ProtestsService } from './protests.service';

export class ProtestSockets extends CommonSocketsConfig {
  constructor(io: socketio.Server, private protestsService: ProtestsService) {
    super(io, 'UsersSockets');
  }

  configureRoutes() {
    this.io.of('/protests').on('connection', (socket: socketio.Socket) => {
      console.log(`↑  Client '${socket.id}' connected to socket /protests`);

      socket.on('addProtest', async (input) => {
        const { title, description, startDate, creatorId } = input;

        try {
          const result = await this.protestsService.addProtest(
            title,
            description,
            startDate,
            creatorId
          );

          socket.emit('addProtest', result);
        } catch (e) {
          console.error(e);

          socket.emit('addProtest', 'Failure');
        }

        return;
      });

      //   socket.on('protests:addProtest', async (input) => {
      //     const { title, description, startDate, creatorId } = input;

      //     try {
      //       const user = await User.findById(creatorId);

      //       if (!user) {
      //         socket.emit('protests:addProtest', 'Failure. User not found.');

      //         return;
      //       }

      //       const userObjectId = user?.get('_id');

      //       const newProtestResult = await Protest.findOneAndUpdate(
      //         { _id: new ObjectId() },
      //         {
      //           $set: {
      //             title,
      //             startDate,
      //             description,
      //             associatedUserIds: [new ObjectId(userObjectId)],
      //           },
      //         },
      //         { upsert: true, new: true }
      //       );

      //       const protestId = newProtestResult?.get('_id');

      //       if (protestId) {
      //         await User.findOneAndUpdate(
      //           { _id: userObjectId },
      //           {
      //             $push: {
      //               associatedProtests: {
      //                 protestId,
      //                 accessLevel: AccessLevels.Leader,
      //                 isCreator: true,
      //               },
      //             },
      //           },
      //           { new: true }
      //         );
      //       }

      //       socket.emit('protests:addProtest', 'Success');
      //     } catch (e) {
      //       console.error(e);

      //       socket.emit('protests:addProtest', 'Failure');
      //     }

      //     return;
      //   });
    });

    return this.io;
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
