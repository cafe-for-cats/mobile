import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { IonicStorageModule } from '@ionic/storage';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { HttpClientModule } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { ProtestsModule } from './components/protests/protests.module';
import { NavbarModule } from './components/navbar/navbar.module';
import { ProtestOverviewAttendeeModule } from './components/protest-overview-attendee/protest-overview-attendee.module';
import { ProtestOverviewLeaderModule } from './components/protest-overview-leader/protest-overview-leader.module';
import { ProtestOverviewOrganizerModule } from './components/protest-overview-organizer/protest-overview-organizer.module';
import { ProtestWelcomeModule } from './components/protest-welcome/protest-welcome.module';
import { ResourcesComponent } from './components/resources/resources.component';
import { CreateProtestComponent } from './components/create-protest/create-protest.component';
import { JoinProtestComponent } from './components/join-protest/join-protest.component';
import { ProtestsDataService } from './components/protests/protests-data.service';

const config: SocketIoConfig = { url: 'http://localhost:5000', options: {} };

@NgModule({
  declarations: [
    AppComponent,
    ResourcesComponent,
    CreateProtestComponent,
    JoinProtestComponent,
  ],
  entryComponents: [],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(),
    AppRoutingModule,
    GooglePlaceModule,
    FormsModule,
    ReactiveFormsModule,
    ProtestsModule,
    ProtestOverviewAttendeeModule,
    ProtestOverviewLeaderModule,
    ProtestOverviewOrganizerModule,
    ProtestWelcomeModule,
    NavbarModule,
    SocketIoModule.forRoot(config),
    JwtModule.forRoot({
      config: {
        tokenGetter: () => {
          return localStorage.getItem('token');
        },
        allowedDomains: ['localhost:5000'],
        disallowedRoutes: ['http://localhost:5000/users/login'],
      },
    }),
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
