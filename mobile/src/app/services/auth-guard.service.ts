import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { JwtService } from './jwt.service';

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(public jwtService: JwtService, public router: Router) {}

  canActivate(): boolean {
    if (!this.jwtService.isLoggedIn) {
      this.router.navigate(['login']);

      return false;
    }

    return true;
  }
}
