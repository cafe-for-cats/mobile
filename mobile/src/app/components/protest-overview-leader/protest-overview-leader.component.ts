import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { combineLatest, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Protest } from '../protest-overview/protest-overview-data.service';

@Component({
  selector: 'app-protest-overview-leader',
  templateUrl: './protest-overview-leader.component.html',
  styleUrls: ['./protest-overview-leader.component.scss'],
})
export class ProtestOverviewLeaderComponent implements OnInit {
  data$: Observable<Protest>;

  constructor(private route: ActivatedRoute, private socket: Socket) {}

  ngOnInit() {
    const getProtest$: Observable<Protest> = this.socket
      .fromEvent('getProtestOverviewView')
      .pipe(map((data: string) => JSON.parse(data)));

    this.data$ = getProtest$.pipe(
      map((protest) => {
        return protest;
      })
    );

    this.route.paramMap.subscribe((params) => {
      this.sendMessage(params.get('id'));
    });
  }

  // have to destroy and unsubscribe?

  sendMessage(id: string) {
    this.socket.emit('getProtestOverviewView', id);
  }
}
