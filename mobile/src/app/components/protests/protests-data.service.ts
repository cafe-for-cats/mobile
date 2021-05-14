import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { JwtService } from 'src/app/services/jwt.service';

@Injectable()
export class ProtestsDataService {
  constructor(private jwtService: JwtService, private socket: Socket) {}

  getProtests() {
    return this.socket.fromEvent('protests:getProtestsForUser');
  }

  requestProtests() {
    this.socket.emit(
      'protests:getProtestsForUser',
      this.jwtService.token.user.id
    );
  }
}
