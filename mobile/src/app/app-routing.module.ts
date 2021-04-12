import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { LoginModule } from './components/login/login.module';
import { ProtestOverviewComponent } from './components/protest-overview/protest-overview.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { AuthGuard } from './services/auth-guard.service';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'welcome',
    component: WelcomeComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'protest/:id',
    component: ProtestOverviewComponent,
    canActivate: [AuthGuard],
    // different COMPONENTS based on access rights or just hid e things on the page?
  }, // something like a 'your protests' page on the welcome with all the prtoests that thje user is associated with
  { path: '', redirectTo: '/login', pathMatch: 'full' }, //redirect to home if logged in
];

@NgModule({
  imports: [RouterModule.forRoot(routes), LoginModule],
  exports: [RouterModule],
  providers: [AuthGuard],
})
export class AppRoutingModule {}
