import {
  async,
  ComponentFixture,
  TestBed,
  inject,
} from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { SettingsPage, Settings } from './settings.page';
import {} from 'jasmine'; // No <3
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('SettingsPage', () => {
  let component: SettingsPage;
  let fixture: ComponentFixture<SettingsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SettingsPage],
      imports: [IonicModule.forRoot(), FormsModule, ReactiveFormsModule],
      providers: [
        {
          provide: Storage,
          useValue: {
            get: () => 'manual',
            keys: () => ['setting:locationPreference'],
            set: () => true,
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the permissions on submit', inject([Storage], (storage) => {
    const spy = spyOn(storage, 'set');

    component.onSubmit();

    expect(spy).toHaveBeenCalledWith(Settings.LocationPreference, 'manual');
  }));
});
