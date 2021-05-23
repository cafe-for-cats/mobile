import socketio from 'socket.io';
import { CommonSocketsConfig } from '../common/common.sockets.config';
import { ProtestsService } from './protests.service';

export class ProtestSockets extends CommonSocketsConfig {
  constructor(io: socketio.Server, private protestsService: ProtestsService) {
    super(io, 'UsersSockets');
  }

  configureSockets() {
    this.io.of('/protests').on('connection', (socket: socketio.Socket) => {
      console.log(`↑  Connected client '${socket.id}' to socket /protests`);

      socket.on('addProtest', async (input) => {
        try {
          const result = await this.protestsService.addProtest(input);

          socket.emit('addProtest', result);
        } catch (e) {
          console.error(e);

          socket.emit('addProtest', 'Failure');
        }

        return;
      });

      socket.on('getProtestsForUser', async ({ userId }) => {
        if (!userId) {
          socket.emit('getProtestsForUser', {
            status: false,
            message: `'input' is required.`,
          });
        }

        const result = await this.protestsService.getProtestsForUser(userId);

        socket.emit('getProtestsForUser', result);
      });
    });

    return this.io;
  }
}
