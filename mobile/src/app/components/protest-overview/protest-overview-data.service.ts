import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Socket } from 'ngx-socket-io';
import { merge, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProtestOverviewDataService {
  all$: Observable<any>;

  constructor(private socket: Socket) {
    const get$ = this.socket.fromEvent<Protest>('getProtest');
    const update$ = this.socket.fromEvent<Protest>('updateProtest');

    this.all$ = merge(get$, update$);
  }

  request(id: string) {
    this.socket.emit('getProtest', id);
  }

  requestUpdate(id: string, title) {
    this.socket.emit('updateProtest', { id, title });
  }

  // how do i break up the edits? i.e. which endpointstare esponsiblefor editing which part of a protest data model.

  receive() {
    return this.all$.pipe(map((data: string): Protest => JSON.parse(data)));
  }
}

interface Protest {
  _id: string;
  users: [];
  title: string;
}
