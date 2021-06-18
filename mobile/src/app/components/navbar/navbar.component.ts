import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { JwtService } from 'src/app/services/jwt.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit {
  constructor(public jwtService: JwtService, private router: Router) {}

  ngOnInit() {}

  onLogout() {
    this.jwtService.logout();
    this.router.navigate(['login']);
  }
}
