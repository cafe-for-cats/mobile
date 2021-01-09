import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss']
})
export class SettingsPage {
  changes: { settingName: string; value: string }[] = [];

  constructor(private storage: Storage) {}

  radioGroupChange(settingName, event) {
    const settingWithGivenName = this.changes.find(
      x => x.settingName == settingName
    );

    if (settingWithGivenName) {
      settingWithGivenName.value = event.detail.value;
    } else {
      this.changes.push({ settingName, value: event.detail.value });
    }
  }

  async handleClick() {
    this.remove(this.changes[0].settingName);

    this.changes &&
      this.changes.forEach(async change => {
        await this.set(change.settingName, change.value);
        const name = await this.get(change.settingName);
        console.log(name);
      });

    this.changes = [];
  }

  async set(settingName, value) {
    return await this.storage.set(`setting:${settingName}`, value);
  }

  async get(settingName) {
    return await this.storage.get(`setting:${settingName}`);
  }

  async remove(settingName) {
    return await this.storage.remove(`setting:${settingName}`);
  }

  async clear() {
    await this.storage.clear();
    return;
  }
}
