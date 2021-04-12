import { NgModule } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { WelcomeComponent } from '../welcome/welcome.component';
import { ProtestOverviewComponent } from './protest-overview.component';

@NgModule({
  imports: [CommonModule, IonicModule],
  declarations: [ProtestOverviewComponent],
})
export class ProtestOverviewModule {}
