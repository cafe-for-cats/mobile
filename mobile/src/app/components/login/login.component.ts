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
      this.router.navigate(['/welcome']);
    }
  }

  // start looking at the access grants stuff. that needs to happen next.

  onSubmit($event: SubmitEvent) {
    const { id } = $event.submitter;

    switch (id) {
      case 'login': {
        this.jwtService
          .login(this.form.value.username, this.form.value.password)
          .subscribe(() => this.router.navigate(['welcome']));
        break;
      }
      case 'register': {
        this.jwtService
          .register(this.form.value.username, this.form.value.password)
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
