import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  async,
  ComponentFixture,
  inject,
  TestBed,
} from '@angular/core/testing';
import { FormBuilder, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { of } from 'rxjs';
import { JwtService } from 'src/app/services/jwt.service';

import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [IonicModule.forRoot(), HttpClientTestingModule],
      providers: [
        {
          provide: JwtService,
          useValue: {
            login: () => of({ token: 'token_string' }),
            register: () => of({ token: 'token_string' }),
            logout: () => {},
          },
        },
        {
          provide: Router,
          useValue: {
            navigate: () => {},
          },
        },
        FormBuilder,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should redirect a user if they are already logged in', inject(
    [Router, JwtService],
    async (routerService: Router, jwtService: JwtService) => {
      const routerSpy = spyOn(routerService, 'navigate');
      spyOnProperty(jwtService, 'isLoggedIn', 'get').and.returnValue(true);
    }
  ));

  xit('should log a user in with proper credentials', async () => {
    fixture.detectChanges();

    await fixture.whenStable();
    fixture.detectChanges();
  });
});
