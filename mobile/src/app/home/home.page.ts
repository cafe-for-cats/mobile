import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {
  constructor(private http: HttpClient) {}

  handleClick(key) {
    this.http
      .post('http://localhost:3000/pins', {
        label: 'mobile test',
        latitude: 1.2,
        longitude: 2.4,
        userId: 123
      })
      .subscribe(res => res);
  }
}
