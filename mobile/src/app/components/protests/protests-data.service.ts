import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { map, tap } from 'rxjs/operators';
import { JwtService } from 'src/app/services/jwt.service';

@Injectable()
export class ProtestsDataService {
  private rootKey = 'protests';
  private addProtestKey = 'addProtest';
  private getProtestsForUserKey = 'getProtestsForUser';

  constructor(private jwtService: JwtService, private socket: Socket) {}

  requestCreateProtest(input) {
    this.socket.emit(`${this.rootKey}:${this.addProtestKey}`, input);
  }

  receiveCreateProtest() {
    return this.socket.fromEvent(`${this.rootKey}:${this.addProtestKey}`).pipe(
      map(({ status }) => (status ? { status: true } : { status: false })),
      tap((_) => {
        this.requestGetProtestsForUser();
      })
    );
  }

  requestGetProtestsForUser() {
    this.socket.emit(
      `${this.rootKey}:${this.getProtestsForUserKey}`,
      this.jwtService.token.user.id
    );
  }

  receiveGetProtestsForUser() {
    return this.socket
      .fromEvent(`${this.rootKey}:${this.getProtestsForUserKey}`)
      .pipe(map((res) => res));
  }
}
