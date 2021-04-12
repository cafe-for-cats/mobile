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

@Component({
  selector: 'app-protest-overview',
  templateUrl: './protest-overview.component.html',
  styleUrls: ['./protest-overview.component.scss'],
})
export class ProtestOverviewComponent implements OnInit {
  data$;

  form = this.formBuilder.group({
    title: [null, Validators.required],
  });

  constructor(
    private protestOverviewDataService: ProtestOverviewDataService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.data$ = this.protestOverviewDataService
      .receive()
      .pipe(map((res) => res));

    this.route.params.subscribe((res) => {
      this.protestOverviewDataService.request(res.id);
    });
  }

  onSubmit() {
    this.protestOverviewDataService.requestUpdate(
      '607262883fd94e20567fd795',
      this.form.value.title
    );
  }
}
