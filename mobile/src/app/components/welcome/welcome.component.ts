import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { map, tap } from 'rxjs/operators';
import { JwtService } from 'src/app/services/jwt.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
})
export class WelcomeComponent implements OnInit {
  form = this.formBuilder.group({
    title: [null, Validators.required],
  });

  data$;

  constructor(
    private formBuilder: FormBuilder,
    private httpClient: HttpClient
  ) {}

  ngOnInit() {}

  onAdd() {
    const title = this.form.value.title;

    this.data$ = this.httpClient
      .post<{ newItem: { id: string } }>('http://localhost:3000/protests/add', {
        title,
      })
      .pipe(map((res) => res.newItem));
  }
}
