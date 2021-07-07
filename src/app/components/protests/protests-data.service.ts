import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { map, tap } from 'rxjs/operators';
import { JwtService } from 'src/app/services/jwt.service';
import { SocketNameSpace } from './socket-namespace';

@Injectable()
export class ProtestsDataService {
  private getProtestsForUserKey = 'getProtestsForUser';
  private protestsSocket = new SocketNameSpace({
    url: 'http://localhost:5000/protests',
    options: {},
  });

  constructor(private jwtService: JwtService, private socket: Socket) {}

  requestCreateProtest(input) {
    this.protestsSocket.emit(`addProtest`, input);
  }

  receiveCreateProtest() {
    return this.protestsSocket.fromEvent(`addProtest`).pipe(
      map(({ status }) => (status ? { status: true } : { status: false })),
      tap((_) => {
        this.requestGetProtestsForUser();
      })
    );
  }

  // join Protest in progress
  requestJoinProtest(input) {
    this.protestsSocket.emit(`joinProtest`, input);
  }
  receiveJoinProtest() {
    return this.protestsSocket.fromEvent(`joinProtest`).pipe(
      map(({ status }) => (status ? { status: true } : { status: false })),
      tap((_) => {
        this.requestGetProtestsForUser();
      })
    );
  }

  /**
   * Emits an event to the Websocket server
   * to get all protests relevant for a given user
   */
  requestGetProtestsForUser() {
    console.log(this.jwtService.token.user.id);

    this.protestsSocket.emit(`getProtestsForUser`, {
      userId: this.jwtService.token.user.id,
    });
  }

  receiveGetProtestsForUser() {
    return this.protestsSocket
      .fromEvent(`getProtestsForUser`)
      .pipe(map((res) => res));
  }
}

export enum accessLevels {
  Admin = -1,
  Leader = 1,
  Organizer = 2,
  Attendee = 3,
  Unassigned = 4,
}
