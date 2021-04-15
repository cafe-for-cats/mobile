import { NgModule } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { ProtestOverviewComponent } from './protest-overview.component';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule],
  declarations: [ProtestOverviewComponent],
  exports: [ProtestOverviewComponent],
})
export class ProtestOverviewModule {}
