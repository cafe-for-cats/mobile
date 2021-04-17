import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Protest } from '../protest-overview/protest-overview-data.service';

@Component({
  selector: 'app-protest-overview-leader',
  templateUrl: './protest-overview-leader.component.html',
  styleUrls: ['./protest-overview-leader.component.scss'],
})
export class ProtestOverviewLeaderComponent implements OnInit {
  data$: Observable<Protest>;
  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.data$ = this.route.paramMap.pipe(
      map((res) => {
        const protest: Protest = JSON.parse(res.get('protest'));

        return protest;
      })
    );
  }
}
