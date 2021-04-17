import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { IonicModule } from '@ionic/angular';
import { ProtestsComponent } from './protests.component';

describe('ProtestsComponent', () => {
  let component: ProtestsComponent;
  let fixture: ComponentFixture<ProtestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProtestsComponent],
      imports: [IonicModule.forRoot(), HttpClientTestingModule],
      providers: [
        {
          provide: JwtHelperService,
          useValue: {
            isTokenExpired: () => true,
          },
        },
        {
          provide: Router,
          useValue: {
            navigate: () => {},
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProtestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
