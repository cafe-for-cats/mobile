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
      console.log(`↑  Connected client '${socket.id}' to socket /protests`);

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
