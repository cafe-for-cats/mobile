import { Socket, SocketIoConfig } from 'ngx-socket-io';

export class SocketNameSpace extends Socket {
  constructor(socketConfig: SocketIoConfig) {
    super(socketConfig);
  }
}
