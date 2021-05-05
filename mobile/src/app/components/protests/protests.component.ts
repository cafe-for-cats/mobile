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
    description: [null, Validators.required],
  });

  data$: Observable<{
    protestsCreated: Protest[];
    protestsJoined: Protest[];
  }>;

  protestAdded$: Observable<any>;

  constructor(
    private formBuilder: FormBuilder,
    private jwtService: JwtService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    const userId = this.jwtService.token.user.id;
    const baseUrl = 'http://localhost:3000/protests/getProtestsView';

    const params: HttpParams = new HttpParams().append('userId', userId);

    this.data$ = this.http
      .get<{
        protestsCreated: Protest[];
        protestsJoined: Protest[];
      }>(`${baseUrl}`, { params })
      .pipe(
        map(({ protestsCreated, protestsJoined }) => {
          return {
            protestsCreated,
            protestsJoined,
          };
        })
      );
  }

  onSubmit() {
    const userId = this.jwtService.token.user.id;
    const baseUrl = 'http://localhost:3000/protests/add';

    this.protestAdded$ = this.http
      .post<{
        newItem: Protest;
      }>(`${baseUrl}`, {
        title: this.title.value,
        description: this.description.value,
        userId,
      })
      .pipe(
        map(({ newItem }) => {
          return {
            newItem,
          };
        })
      );
  }

  get title() {
    return this.form.get('title');
  }

  get description() {
    return this.form.get('description');
  }
}

export interface Protest {
  _id: string;
  title: string;
  description: string;
  associatedUsers: { _id: string; accessLevel: string };
}
