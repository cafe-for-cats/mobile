import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { JwtService } from 'src/app/services/jwt.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  form = this.formBuilder.group({
    username: [null, Validators.required],
    password: [null, Validators.required],
  });

  constructor(
    private formBuilder: FormBuilder,
    private jwtService: JwtService,
    private router: Router
  ) {}

  ngOnInit() {
    if (this.jwtService.isLoggedIn) {
      this.router.navigate(['protests']);
    }
  }

  onSubmit(form: NgForm) {
    this.jwtService
      .login(form.value.username, form.value.password)
      .subscribe(() => this.router.navigate(['protests']));
  }

  get username() {
    return this.form.get('username');
  }

  get password() {
    return this.form.get('password');
  }
}

interface SubmitEvent extends Event {
  submitter: HTMLElement;
}
