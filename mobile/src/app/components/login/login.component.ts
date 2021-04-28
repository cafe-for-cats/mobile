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
      this.router.navigate(['protests']);
    }
  }

  onSubmit($event: SubmitEvent) {
    const { id } = $event.submitter;

    switch (id) {
      case 'login': {
        this.jwtService
          .login(this.username.value, this.password.value)
          .subscribe(() => this.router.navigate(['protests']));
        break;
      }
      case 'register': {
        this.jwtService
          .register(this.username.value, this.password.value)
          .subscribe();
        break;
      }
      default: {
        // error
        break;
      }
    }
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
