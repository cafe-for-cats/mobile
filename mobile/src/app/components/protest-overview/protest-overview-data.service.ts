import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Socket } from 'ngx-socket-io';
import { BehaviorSubject, merge, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProtestOverviewDataService {
  all$: Observable<any>;

  getView$ = this.socket.fromEvent<string>('getProtestsView');

  protestView: BehaviorSubject<Protest[]> = new BehaviorSubject([]);

  constructor(private socket: Socket) {
    const get$ = this.socket.fromEvent<Protest>('getProtest');
    const update$ = this.socket.fromEvent<Protest>('updateProtest');

    this.all$ = merge(get$, update$); // TODO: Do I want to be updating all consumers of these events on every fire of each call?
  }

  requestView(userId: string) {
    this.socket.emit('getProtestsView', { userId });
  }

  request(id: string, shareUrl: string) {
    this.socket.emit('getProtest', { id, shareUrl });
  }

  requestUpdate(id: string, input: unknown) {
    this.socket.emit('updateProtest', { id, input });
  }

  // how do i break up the edits? i.e. which endpointstare esponsiblefor editing which part of a protest data model.
  // annoucements vs protest details vs map info?

  receive() {
    return this.all$.pipe(map((data: string): Protest => JSON.parse(data)));
  }
}

export interface Protest {
  _id: string;
  title: string;
  description: string;
  startDate: Date;
}
