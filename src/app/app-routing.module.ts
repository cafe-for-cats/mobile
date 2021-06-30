import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { LoginModule } from './components/login/login.module';
import { MyProtestsComponent } from './components/protests/my-protests/my-protests.component';
import { ProtestsComponent } from './components/protests/protests.component';
import { ResourcesComponent } from './components/resources/resources.component';
import { AuthGuard } from './services/auth-guard.service';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'protests',
    component: ProtestsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'my-protests',
    component: MyProtestsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'resources',
    component: ResourcesComponent,
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' }, //redirect to home if logged in
];

@NgModule({
  imports: [RouterModule.forRoot(routes), LoginModule],
  exports: [RouterModule],
  providers: [AuthGuard],
})
export class AppRoutingModule {}
