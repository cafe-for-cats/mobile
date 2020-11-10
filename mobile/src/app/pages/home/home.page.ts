/// <reference types="@types/googlemaps" />

import { Component, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-home-page',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})
export class HomePage {
  data$: Observable<any>;

  constructor(private http: HttpClient) {}

  ionViewDidEnter() {
    this.data$ = this.http.get('http://localhost:3000/pins');
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
