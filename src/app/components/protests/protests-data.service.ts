import { HttpClient } from '@angular/common/http';
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

  constructor(
    private jwtService: JwtService,
    private socket: Socket,
    private httpClient: HttpClient
  ) {}

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

  getProtestByShareToken(token) {
    return this.httpClient.get(`http://localhost:5000/protests/${token}`);
  }

  postJoinProtest(protestId) {
    const associatedUser = {
      protestId: protestId,
      userId: this.jwtService.token.user.id,
      accessLevel: 1, //assigns the user as unassigned
    };
    console.log(protestId);
    this.httpClient
      .post('http://localhost:5000/protests/addUser/', associatedUser)
      .subscribe((res) => {
        if (res) {
          console.log(res);
          return res;
        }
      });
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

export enum accessLevels {
  Organizer = 3,
  Attendee = 2,
  Unassigned = 1,
  Admin = -1,
}
