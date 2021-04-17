import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { LoginModule } from './components/login/login.module';
import { ProtestOverviewAttendeeComponent } from './components/protest-overview-attendee/protest-overview-attendee.component';
import { ProtestOverviewLeaderComponent } from './components/protest-overview-leader/protest-overview-leader.component';
import { ProtestOverviewOrganizerComponent } from './components/protest-overview-organizer/protest-overview-organizer.component';
import { ProtestOverviewComponent } from './components/protest-overview/protest-overview.component';
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
    path: 'protest/:id/attendee',
    component: ProtestOverviewAttendeeComponent,
    canActivate: [AuthGuard /* AccessRightsGuard */],
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

  // different COMPONENTS based on access rights or just hid e things on the page?
  // something like a 'your protests' page on the welcome with all the prtoests that thje user is associated with
];

@NgModule({
  imports: [RouterModule.forRoot(routes), LoginModule],
  exports: [RouterModule],
  providers: [AuthGuard],
})
export class AppRoutingModule {}
