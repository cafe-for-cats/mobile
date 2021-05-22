import * as socketio from 'socket.io';
import { CommonSocketsConfig } from '../common/common.sockets.config';
import { UsersService } from './users.service';

export class UserSockets extends CommonSocketsConfig {
  constructor(io: socketio.Server, private usersService: UsersService) {
    super(io, 'UsersSockets');
  }

  configureRoutes() {
    console.log(`No sockets are registered for Users`);

    return this.io;
  }
}
