import { BehaviorSubject } from 'rxjs';
import { io, Manager } from 'socket.io-client';

export class ProtestDataService {
  socket;
  protests: BehaviorSubject<any> = new BehaviorSubject({});

  constructor() {
    const manager = new Manager('ws://localhost:3000/socket.io', {
      reconnectionDelayMax: 10000,
      query: {
        'my-key': 'my-value',
      },
    });
    this.socket = manager.socket('/', {
      // auth: {
      //   token: "123"
      // }
    });
  }

  emitRequest() {
    this.socket.emit('getProtests');
  }
}
