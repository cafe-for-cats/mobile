import * as socketio from 'socket.io';

export abstract class CommonSocketsConfig {
  io: socketio.Server;
  private name: string;

  constructor(io: socketio.Server, name: string) {
    this.io = io;
    this.name = name;
    this.configureSockets();
  }

  getName() {
    return this.name;
  }

  abstract configureSockets(): socketio.Server;
}
