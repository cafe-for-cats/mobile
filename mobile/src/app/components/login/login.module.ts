import { NgModule } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { LoginComponent } from './login.component';
import { LoginComponentRoutingModule } from './login-routing.module';

@NgModule({
  imports: [
    LoginComponentRoutingModule,
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
  ],
  declarations: [LoginComponent],
})
export class LoginModule {}
