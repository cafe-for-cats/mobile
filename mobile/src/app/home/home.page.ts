/// <reference types="@types/googlemaps" />

import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Component({
  selector: 'app-home-page',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})
export class HomePage {
  /** The component responsible for creating the Map within an HTML Element */
  map: google.maps.Map;

  /** Each pop-up window that provides additional information about a marker */
  infoWindows: google.maps.InfoWindow[] = [];

  /** Tracks which info window is currently open */
  openedInfoWindows: google.maps.InfoWindow[] = [];

  @ViewChild('map', { read: ElementRef, static: false }) mapRef: ElementRef;

  constructor(private http: HttpClient) {}

  ionViewDidEnter() {
    this.http.get('http://localhost:3000/pins').subscribe((data: Pin[]) => {
      const markers = data.map(({ label, latitude, longitude }) => {
        return {
          title: label,
          latitude,
          longitude
        };
      });

      this.showMap(markers[0]);
      this.addMarkersToMap(markers);
    });
  }

  addMarkersToMap(markers) {
    for (let marker of markers) {
      let position: google.maps.LatLng = new google.maps.LatLng(
        marker.latitude,
        marker.longitude
      );
      let mapMarker: google.maps.Marker = new google.maps.Marker({
        position: position,
        title: marker.title
      });

      mapMarker.setMap(this.map);
      this.addInfoWindowToMarker(mapMarker);
    }
  }

  addInfoWindowToMarker(marker: google.maps.Marker) {
    const pos = marker.getPosition();
    let infoWindowContent = `
   <div style="color: black" id="content"> 
     <h2 id="firstHeading" class="firstHeading"> ${marker.getTitle()} </h2>
     <p>Latitude: ${pos.lat()} </p>
     <p>Longitude: ${pos.lng()} </p> 
   </div>`;

    let infoWindow = new google.maps.InfoWindow({
      content: infoWindowContent
    });

    marker.addListener('click', () => {
      this.closeOpenedInfoWindows();
      infoWindow.open(this.map, marker);
      this.openedInfoWindows.push(infoWindow);
    });
    this.infoWindows.push(infoWindow);
  }

  closeOpenedInfoWindows() {
    for (let window of this.openedInfoWindows) {
      this.openedInfoWindows.pop();
      window.close();
    }
  }

  showMap(position) {
    const location = new google.maps.LatLng(
      position.latitude,
      position.longitude
    );
    const options = {
      center: location,
      zoom: 15,
      disableDefaultUI: true
    };
    this.map = new google.maps.Map(this.mapRef.nativeElement, options);
  }
}

interface Marker {
  title: string;
  latitude: number;
  longitude: number;
}

interface Pin {
  pin_id: string;
  user_id: string;
  latitude: number;
  longitude: number;
  label: string;
  create_date?: Date;
}
