/// <reference types="@types/googlemaps" />

import { Component, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-home-page',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})
export class HomePage {
  data$: Observable<any>;
  refresh$: BehaviorSubject<any> = new BehaviorSubject(true);

  constructor(private http: HttpClient) {}

  ionViewDidEnter() {
    this.data$ = this.refresh$.pipe(
      switchMap(_ => this.http.get('http://localhost:3000/pins'))
    );
  }

  refresh() {
    this.refresh$.next(true);
  }
}

interface Pin {
  pin_id: string;
  user_id: string;
  latitude: number;
  longitude: number;
  label: string;
  create_date?: Date;
}
