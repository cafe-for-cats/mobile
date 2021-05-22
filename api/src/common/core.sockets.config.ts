import * as socketio from 'socket.io';
import { CommonSocketsConfig } from './common.sockets.config';

export class CoreSockets extends CommonSocketsConfig {
  constructor(io: socketio.Server) {
    super(io, 'CoreSockets');
  }

  configureSockets() {
    this.io.on('connection', (socket: socketio.Socket) => {
      console.log(`↑  Connected client '${socket.id}' to io.`);

      socket.on('disconnect', () => {
        console.log(`↓  Disconnected client '${socket.id}' from io.`);
      });
    });

    return this.io;
  }
}
