import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
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
      .post<{ access_token: string }>('http://localhost:3000/auth/register', {
        username,
        password,
      })
      .pipe(
        tap((res) => {
          this.login(username, password);
        })
      );
  }

  logout() {
    localStorage.removeItem('token');
  }
}
