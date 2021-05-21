import * as socketio from 'socket.io';
import { CommonSocketsConfig } from '../common/common.sockets.config';
import { UsersService } from './users.service';

export class UserSockets extends CommonSocketsConfig {
  constructor(io: socketio.Server, private usersService: UsersService) {
    super(io, 'UsersSockets');
  }

  configureRoutes() {
    this.io.of('/users').on('connection', (socket: socketio.Socket) => {
      console.log('connected here');

      socket.on('testusermessage', () => {
        console.log('here');

        socket.emit('testusermessage');
      });
    });

    return this.io;
  }
}
