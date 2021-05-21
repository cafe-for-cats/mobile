import * as socketio from 'socket.io';

export abstract class CommonSocketsConfig {
  io: socketio.Server;
  name: string;

  constructor(io: socketio.Server, name: string) {
    this.io = io;
    this.name = name;
    this.configureRoutes();
  }

  getName() {
    return this.name;
  }

  abstract configureRoutes(): socketio.Server;
}
