import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class JwtService {
  constructor(private httpClient: HttpClient) {}

  public get loggedIn(): boolean {
    return localStorage.getItem('access_token') !== null;
  }

  login(username: string, password: string) {
    return this.httpClient
      .post<{ token: string }>('http://localhost:3000/auth/login', {
        username,
        password,
      })
      .pipe(
        tap((res) => {
          localStorage.setItem('token', res.token);
        })
      );
  }

  register(username: string, password: string) {
    return this.httpClient
      .post<{ token: string }>('http://localhost:3000/auth/register', {
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
