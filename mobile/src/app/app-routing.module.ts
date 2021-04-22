import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { LoginModule } from './components/login/login.module';
import { ProtestOverviewAttendeeComponent } from './components/protest-overview-attendee/protest-overview-attendee.component';
import { ProtestOverviewLeaderComponent } from './components/protest-overview-leader/protest-overview-leader.component';
import { ProtestOverviewOrganizerComponent } from './components/protest-overview-organizer/protest-overview-organizer.component';
import { ProtestWelcomeComponent } from './components/protest-welcome/protest-welcome.component';
import { ProtestsComponent } from './components/protests/protests.component';
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
    path: 'protest/:protestId/welcome/:shareId', // limits on how many times a link can be used?
    component: ProtestWelcomeComponent,
    canActivate: [AuthGuard /* AccessRightsGuard */],
  },
  {
    path: 'protest/:id/attendee',
    component: ProtestOverviewAttendeeComponent,
    canActivate: [AuthGuard /* AccessRightsGuard */],
    data: { protest: {} },
  },
  {
    path: 'protest/:id/organizer',
    component: ProtestOverviewOrganizerComponent,
    canActivate: [AuthGuard /* AccessRightsGuard */],
  },
  {
    path: 'protest/:id/leader',
    component: ProtestOverviewLeaderComponent,
    canActivate: [AuthGuard /* AccessRightsGuard */],
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' }, //redirect to home if logged in
];

@NgModule({
  imports: [RouterModule.forRoot(routes), LoginModule],
  exports: [RouterModule],
  providers: [AuthGuard],
})
export class AppRoutingModule {}
