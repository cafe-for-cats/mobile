import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { JwtService } from 'src/app/services/jwt.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  form = this.formBuilder.group({
    username: '',
    password: '',
  });

  constructor(
    private formBuilder: FormBuilder,
    private jwtService: JwtService,
    private router: Router
  ) {}

  ngOnInit() {}

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
