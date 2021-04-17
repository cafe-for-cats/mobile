import { HttpClient } from '@angular/common/http';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { Socket } from 'dgram';
import { Manager } from 'socket.io-client';
import { DefaultEventsMap } from 'socket.io-client/build/typed-events';
import { webSocket } from 'rxjs/webSocket';
import { catchError, map, tap } from 'rxjs/operators';
import { ProtestOverviewDataService } from './protest-overview-data.service';
import { FormBuilder, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-protest-overview',
  templateUrl: './protest-overview.component.html',
  styleUrls: ['./protest-overview.component.scss'],
})
export class ProtestOverviewComponent implements OnInit {
  data$: Observable<ProtestOverviewView>;
  id: string;

  form = this.formBuilder.group({
    title: [null, Validators.required],
  });

  constructor(
    private protestOverviewDataService: ProtestOverviewDataService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  // attached DIFFERENT access level objects based on the type of url/access code pair sent.

  ngOnInit() {
    this.data$ = this.protestOverviewDataService.receive().pipe(
      map((res) => {
        const { title } = res;
        const {
          leaderUrlId: leaderShareId,
          organizerUrlId: organizerShareId,
          attendeeUrlId: attendeeShareId,
        } = res.shareUrls;

        const leaderUrlId = `${this.router.url}?shareLinkId='${leaderShareId}'`;
        const organizerUrlId = `${this.router.url}?shareLinkId='${organizerShareId}'`;
        const attendeeUrlId = `${this.router.url}?shareLinkId='${attendeeShareId}'`;

        return {
          title,
          leaderUrlId,
          organizerUrlId,
          attendeeUrlId,
        };
      })
    );

    this.route.params.subscribe(({ id }) => {
      this.id = id;

      this.protestOverviewDataService.request(
        this.id,
        '44c84da2-f220-4db8-8449-75e3783d6c70'
      );
    });
  }

  onSubmit() {
    this.protestOverviewDataService.requestUpdate(
      this.id,
      this.form.value.title
    );
  }
}

interface ProtestOverviewView {
  title: string;
  leaderUrlId: string;
  attendeeUrlId: string;
  organizerUrlId: string;
}
