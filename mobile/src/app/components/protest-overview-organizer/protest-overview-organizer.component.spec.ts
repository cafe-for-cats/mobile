import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ProtestOverviewOrganizerComponent } from './protest-overview-organizer.component';

describe('ProtestOverviewOrganizerComponent', () => {
  let component: ProtestOverviewOrganizerComponent;
  let fixture: ComponentFixture<ProtestOverviewOrganizerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProtestOverviewOrganizerComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ProtestOverviewOrganizerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
