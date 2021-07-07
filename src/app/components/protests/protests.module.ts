import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ProtestsComponent } from './protests.component';
import { RouterModule } from '@angular/router';
import { ProtestsDataService } from './protests-data.service';
import { CreateProtestComponent } from './create-protest/create-protest.component';
import { JoinProtestComponent } from './join-protest/join-protest.component';

@NgModule({
  declarations: [
    ProtestsComponent,
    CreateProtestComponent,
    JoinProtestComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  providers: [ProtestsDataService],
  exports: [ProtestsComponent],
})
export class ProtestsModule {}
