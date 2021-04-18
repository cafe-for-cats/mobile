import { HttpClient, HttpParams } from '@angular/common/http';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import {
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, pluck, tap } from 'rxjs/operators';
import { JwtService } from 'src/app/services/jwt.service';
import {
  Protest,
  ProtestOverviewDataService,
} from '../protest-overview/protest-overview-data.service';
import { ProtestsDataService } from './protests-data.service';

@Component({
  selector: 'app-protests',
  templateUrl: './protests.component.html',
  styleUrls: ['./protests.component.scss'],
})
export class ProtestsComponent implements OnInit {
  form = this.formBuilder.group({
    title: [null, Validators.required],
  });

  data$: Observable<{
    createdProtests: Protest[];
    joinedProtests: Protest[];
  }>;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private jwtService: JwtService,
    private dataService: ProtestsDataService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    const id = this.jwtService.token.user.id;
    const baseUrl = 'http://localhost:3000/protests/getProtestOverviewView';

    this.data$ = this.http
      .get<{ createdProtests: Protest[]; joinedProtests: Protest[] }>(
        `${baseUrl}/${id}`
      )
      .pipe(
        map(({ createdProtests, joinedProtests }) => {
          return {
            createdProtests,
            joinedProtests,
          };
        })
      );
  }

  onNavigateToCreatedProtests(protest: Protest) {
    const { _id } = protest;

    this.router.navigate([`protest/${_id}/leader`]);
  }

  // onNavigateToProtest(protest: Protest) {
  //   const userId = this.jwtService.token.user.id;
  //   const protestId = protest._id;

  //   const { accessLevels: usersAccessLevels } = protest.users.find(
  //     (x) => x.id == userId
  //   );

  //   if (usersAccessLevels.includes('CanShareProtest')) {
  //     this.router.navigate([
  //       `protest/${protestId}/leader`,
  //       { protest: JSON.stringify(protest) },
  //     ]);
  //   } else if (usersAccessLevels.includes('CanAddAnnoucements')) {
  //     this.router.navigateByUrl(`protest/${protestId}/organizer`);
  //   } else if (usersAccessLevels.includes('CanViewProtest')) {
  //     this.router.navigateByUrl(`protest/${protestId}/attendee`);
  //   } else {
  //     this.router.navigateByUrl(`unauthorized`);
  //   }
  // }
}

type LeaderAccessLevels = 'CanShareProtests';

type OrganizerAccessLevels = 'CanAddAnnoucements';
