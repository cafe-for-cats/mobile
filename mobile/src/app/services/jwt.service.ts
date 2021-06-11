import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class JwtService {
  constructor(
    private httpClient: HttpClient,
    private jwtHelperService: JwtHelperService
  ) {}

  public get isLoggedIn(): boolean {
    const token = localStorage.getItem('token');

    if (!token) return false;

    if (this.jwtHelperService.isTokenExpired(token)) return false;

    return true;
  }

  public get token(): { user: { id: string } } {
    const token = localStorage.getItem('token');

    if (!token) return null;

    const decoded = this.jwtHelperService.decodeToken(token);

    return decoded;
  }

  login(username: string, password: string) {
    return this.httpClient
      .post<{ payload: { token: string } }>(
        'http://localhost:5000/users/login',
        {
          username,
          password,
        }
      )
      .pipe(
        tap((res) => {
          localStorage.setItem('token', res.payload.token);
        })
      );
  }

  register(username: string, password: string) {
    return this.httpClient
      .post<{ token: string }>('http://localhost:5000/users/register', {
        username,
        password,
      })
      .pipe(
        tap(() => {
          this.login(username, password); // should this send to `login` or set the token and just send to the home page
        })
      );
  }

  logout() {
    localStorage.removeItem('token');
  }
}

interface LoginResponse {
  payload: { token: string };
}
