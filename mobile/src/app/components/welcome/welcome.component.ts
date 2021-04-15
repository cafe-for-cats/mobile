import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { map, pluck, tap } from 'rxjs/operators';
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
    private httpClient: HttpClient,
    private router: Router,
    private jwtService: JwtService
  ) {}

  ngOnInit() {}

  onAdd() {
    const title = this.form.value.title;
    const userId = this.jwtService.token.user.id;
    // TODO: make 'add a protest' its own component

    this.data$ = this.httpClient
      .post<{ newItem: { id: string } }>('http://localhost:3000/protests/add', {
        title,
        userId,
      })
      .pipe(
        pluck('newItem'),
        map((res) => res)
      );
  }

  onNavigateToProtest(id) {
    this.router.navigateByUrl(`protest/${id}`);
  }
}
