import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Protest } from '../protests/protests.component';

@Component({
  selector: 'app-protest-overview-leader',
  templateUrl: './protest-overview-leader.component.html',
  styleUrls: ['./protest-overview-leader.component.scss'],
})
export class ProtestOverviewLeaderComponent implements OnInit {
  data$: Observable<any>;
  shareId$: Observable<string>;

  constructor(
    private route: ActivatedRoute,
    private socket: Socket,
    private http: HttpClient
  ) {}

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
      const id = params.get('id');

      this.sendMessage(id);
    });
  }

  // have to destroy and unsubscribe?

  sendMessage(id: string) {
    this.socket.emit('getProtestOverviewView', id);
  }

  generateShareUrl(id, shareUrlType: string) {
    const input = {
      id: id,
      urlType: shareUrlType,
    };

    const post = this.http.post(
      'http://localhost:3000/protests/setProtestShareLinks',
      input
    );

    post.subscribe((res: any) => {
      alert(
        `Share this url to other organizers: 'http://localhost:8100/protest/${id}/${res.shareUrl}'`
      );
    });
  }
}
