import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { map, tap } from 'rxjs/operators';
import { JwtService } from 'src/app/services/jwt.service';
import { SocketNameSpace } from './socket-namespace';

@Injectable()
export class ProtestsDataService {
  private rootKey = 'protests';
  private addProtestKey = 'addProtest';
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
