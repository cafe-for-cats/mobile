import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MyProtestsComponent } from './my-protests.component';

describe('MyProtestsComponent', () => {
  let component: MyProtestsComponent;
  let fixture: ComponentFixture<MyProtestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MyProtestsComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(MyProtestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
