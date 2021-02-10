import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ToastController } from '@ionic/angular';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss']
})
export class SettingsPage {
  changes: { settingName: string; value: string }[] = [];
  settings: { locationPreference: string } = { locationPreference: '' };

  form: FormGroup;

  constructor(
    private storage: Storage,
    private toastController: ToastController,
    private formBuilder: FormBuilder
  ) {}

  async ngOnInit() {
    this.form = this.formBuilder.group({
      location: ['']
    });

    const keys = await this.storage.keys();

    // Set default settings if they haven't been loaded in before.
    if (!keys.find(x => x == Settings.LocationPreference)) {
      await this.storage.set(Settings.LocationPreference, 'manual');
    }

    this.settings.locationPreference = await this.storage.get(
      Settings.LocationPreference
    );

    this.form.setValue({
      location: this.settings.locationPreference
    });
  }

  async onSubmit() {
    await this.storage.set(
      Settings.LocationPreference,
      this.form.value.location
    );

    this.presentToast('Changes saved.');
  }

  async set(settingName, value) {
    return await this.storage.set(settingName, value);
  }

  async get(settingName) {
    return await this.storage.get(settingName);
  }

  async remove(settingName) {
    return await this.storage.remove(settingName);
  }

  async clear() {
    await this.storage.clear();
    return;
  }

  private async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2500
    });

    toast.present();
  }
}

export enum Settings {
  LocationPreference = 'setting:locationPreference',
  TimeZone = 'setting:timeZone'
}
