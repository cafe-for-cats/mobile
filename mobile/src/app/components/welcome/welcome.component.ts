import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtService } from 'src/app/services/jwt.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
})
export class WelcomeComponent implements OnInit {
  constructor(private jwtService: JwtService, private router: Router) {}

  ngOnInit() {}

  onLogout() {
    this.jwtService.logout();
    this.router.navigate(['login']);
  }
}
