import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Socket } from 'ngx-socket-io';
import { merge } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProtestOverviewDataService {
  all$;

  constructor(private socket: Socket) {
    const get$ = this.socket.fromEvent('getProtest');
    const update$ = this.socket.fromEvent('updateProtest');

    this.all$ = merge(get$, update$);
  }

  request(id: string) {
    this.socket.emit('getProtest', id);
  }

  requestUpdate(id: string, title: string) {
    this.socket.emit('updateProtest', { id, title });
  }

  receive() {
    return this.all$.pipe(map((data: string) => JSON.parse(data)));
  }
}
