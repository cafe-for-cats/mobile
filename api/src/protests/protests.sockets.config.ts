import * as socketio from 'socket.io';
import { CommonSocketsConfig } from '../common/common.sockets.config';
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

  configureSockets() {
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

      socket.on('getProtestsForUser', async (input) => {
        if (!input) {
          socket.emit('getProtestsForUser', {
            status: false,
            message: `'input' is required.`,
          });
        }

        const result = await this.protestsService.getProtestsForUser(input);

        socket.emit('getProtestsForUser', JSON.stringify(result, null, 2));
      });
    });

    return this.io;
  }
}
