import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ProtestOverviewLeaderComponent } from './protest-overview-leader.component';

describe('ProtestOverviewLeaderComponent', () => {
  let component: ProtestOverviewLeaderComponent;
  let fixture: ComponentFixture<ProtestOverviewLeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProtestOverviewLeaderComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ProtestOverviewLeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
