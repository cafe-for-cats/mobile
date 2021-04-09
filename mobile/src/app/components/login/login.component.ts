import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { JwtService } from 'src/app/services/jwt.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
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
      this.router.navigate(['/welcome']); // is this the best way to handle the redirect when a user goes to the login page but already has their token?
    }
  }

  onLogin() {
    this.jwtService
      .login(this.form.value.username, this.form.value.password)
      .subscribe(() => this.router.navigate(['welcome']));
  }

  onRegister() {
    this.jwtService
      .register(this.form.value.username, this.form.value.password)
      .subscribe();
  }
}
