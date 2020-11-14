import { NgModule } from '@angular/core';
import { GoogleMapsComponent } from './google-maps.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';

@NgModule({
  imports: [CommonModule, HttpClientModule, IonicModule],
  declarations: [GoogleMapsComponent],
  exports: [GoogleMapsComponent]
})
export class GoogleMapsModule {}
