import { NgModule } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { WelcomeComponent } from './welcome.component';

@NgModule({
  imports: [CommonModule, IonicModule, FormsModule, ReactiveFormsModule],
  declarations: [WelcomeComponent],
  exports: [WelcomeComponent],
})
export class WelcomeModule {}
