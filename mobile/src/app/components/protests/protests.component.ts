import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { JwtService } from 'src/app/services/jwt.service';

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
    protestsCreated: Protest[];
    protestsJoined: Protest[];
  }>;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private jwtService: JwtService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    const userId = this.jwtService.token.user.id;
    const baseUrl = 'http://localhost:3000/protests/getProtestsView';

    const httpParams: HttpParams = new HttpParams().set('userId', userId);

    this.data$ = this.http
      .get<{
        protestsCreated: Protest[];
        protestsJoined: Protest[];
      }>(`${baseUrl}`, { params: httpParams })
      .pipe(
        map(({ protestsCreated, protestsJoined }) => {
          return {
            protestsCreated,
            protestsJoined,
          };
        })
      );
  }
}

export interface Protest {
  _id: string;
  title: string;
  description: string;
  startDate: Date;
}
