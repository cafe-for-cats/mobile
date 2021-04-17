import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Socket } from 'ngx-socket-io';
import { BehaviorSubject, merge, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProtestsDataService {
  private getView$ = this.httpClient.get('localhost:3000/protests/getByUserId');

  protestView: BehaviorSubject<Protest[]> = new BehaviorSubject([]);

  constructor(private httpClient: HttpClient) {}
}

export interface Protest {
  _id: string;
  users: [];
  title: string;
  shareUrls: {
    leaderUrlId: string;
    organizerUrlId: string;
    attendeeUrlId: string;
  };
}
