import * as socketio from 'socket.io';
import { CommonSocketsConfig } from '../common/common.sockets.config';
import { UsersService } from './users.service';

export class UserSockets extends CommonSocketsConfig {
  constructor(io: socketio.Server) {
    super(io, 'UsersSockets');
  }

  configureSockets() {
    console.log(`No sockets are registered for Users`);

    return this.io;
  }
}
