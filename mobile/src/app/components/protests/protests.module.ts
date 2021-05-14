import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { ProtestsComponent } from './protests.component';
import { RouterModule } from '@angular/router';
import { ProtestsDataService } from './protests-data.service';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  providers: [ProtestsDataService],
  declarations: [ProtestsComponent],
  exports: [ProtestsComponent],
})
export class ProtestsModule {}
