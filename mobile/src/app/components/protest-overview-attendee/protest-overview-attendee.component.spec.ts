import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ProtestOverviewAttendeeComponent } from './protest-overview-attendee.component';

describe('ProtestOverviewAttendeeComponent', () => {
  let component: ProtestOverviewAttendeeComponent;
  let fixture: ComponentFixture<ProtestOverviewAttendeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProtestOverviewAttendeeComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ProtestOverviewAttendeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
