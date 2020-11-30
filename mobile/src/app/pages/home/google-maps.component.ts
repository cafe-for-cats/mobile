// example-app.ts
import { Component, ViewChild } from '@angular/core';
import { MapInfoWindow, MapMarker } from '@angular/google-maps';

/** Demo Component for @angular/google-maps/map */
@Component({
  selector: 'app-google-map',
  templateUrl: './google-map.component.html'
})
export class GoogleMap {
  @ViewChild(MapInfoWindow, { static: false }) infoWindow: MapInfoWindow;

  center = { lat: 0, lng: 0 };

  markerOptions = { draggable: false };

  markerPositions: google.maps.LatLngLiteral[] = [];

  zoom = 12;

  display?: google.maps.LatLngLiteral;

  addMarker(event: google.maps.MouseEvent) {
    this.markerPositions.push(event.latLng.toJSON());
  }

  openInfoWindow(marker: MapMarker) {
    this.infoWindow.open(marker);
  }

  removeLastMarker() {
    this.markerPositions.pop();
  }
}
