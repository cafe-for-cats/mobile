import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, pluck, map } from 'rxjs/operators';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions,
  CameraPosition,
  MarkerOptions,
  Marker,
  Environment
} from '@ionic-native/google-maps';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {
  map: GoogleMap;

  url = 'http://localhost:3000/';
  data$;
  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.data$ = this.http.get(`${this.url}pins`).pipe(map(res => res));
  }

  ionViewDidLoad() {
    this.loadMap();
  }

  loadMap() {
    // This code is necessary for browser
    Environment.setEnv({
      API_KEY_FOR_BROWSER_RELEASE: '***',
      API_KEY_FOR_BROWSER_DEBUG: '***'
    });

    let mapOptions: GoogleMapOptions = {
      camera: {
        target: {
          lat: 43.0741904,
          lng: -89.3809802
        },
        zoom: 18,
        tilt: 30
      }
    };

    this.map = GoogleMaps.create('map_canvas', mapOptions);

    let marker: Marker = this.map.addMarkerSync({
      title: 'Ionic',
      icon: 'blue',
      animation: 'DROP',
      position: {
        lat: 43.0741904,
        lng: -89.3809802
      }
    });
    marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
      alert('clicked');
    });
  }

  handleClick(label) {
    this.http
      .post(`${this.url}pins`, {
        label,
        latitude: 1.2,
        longitude: 2.4,
        userId: 123
      })
      .subscribe(res => res);
  }
}
