import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage, SettingsServiceMock } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { GoogleMapsModule } from '@angular/google-maps';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    CommonModule,
    // import HttpClientModule after BrowserModule.
    HttpClientModule,
    GoogleMapsModule
  ],
  declarations: [HomePage],
  providers: [SettingsServiceMock]
})
export class HomePageModule {}
