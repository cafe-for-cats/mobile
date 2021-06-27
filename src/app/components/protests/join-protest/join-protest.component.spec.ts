import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { JoinProtestComponent } from './join-protest.component';

describe('JoinProtestComponent', () => {
  let component: JoinProtestComponent;
  let fixture: ComponentFixture<JoinProtestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JoinProtestComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(JoinProtestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
