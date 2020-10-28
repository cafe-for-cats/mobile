import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, pluck, map } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {
  url = 'http://localhost:3000/';
  data$;
  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.data$ = this.http.get(`${this.url}pins`).pipe(map(res => res));
  }

  handleClick(key) {
    this.http
      .post(`${this.url}pins`, {
        label: 'mobile test',
        latitude: 1.2,
        longitude: 2.4,
        userId: 123
      })
      .subscribe(res => res);
  }
}
