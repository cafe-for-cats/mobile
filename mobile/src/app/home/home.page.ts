/// <reference types="@types/googlemaps" />

import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {
  map: any;

  @ViewChild('map', { read: ElementRef, static: false }) mapRef: ElementRef;

  infoWindows: any = [];
  markers: Marker[] = [
    {
      title: 'National Art Gallery',
      latitude: '-17.824991',
      longitude: '31.049295'
    },
    {
      title: 'West End Hospital',
      latitude: '-17.820987',
      longitude: '31.039682'
    },
    {
      title: 'Dominican Convent School',
      latitude: '-17.822647',
      longitude: '31.052042'
    },
    {
      title: 'Chop Chop Brazilian Steakhouse',
      latitude: '-17.819460',
      longitude: '31.053844'
    },
    {
      title: 'Canadian Embassy',
      latitude: '-17.820972',
      longitude: '31.043587'
    }
  ];

  constructor() {}

  ionViewDidEnter() {
    this.showMap();
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
    let infoWindowContent =
      `<div style="color: black" id="content">` +
      '<h2 id="firstHeading" class="firstHeading">' +
      marker.getTitle() +
      '</h2>' +
      '<p>Latitude: ' +
      pos.lat() +
      '</p>' +
      '<p>Longitude: ' +
      pos.lng() +
      '</p>' +
      '</div>';

    let infoWindow = new google.maps.InfoWindow({
      content: infoWindowContent
    });

    marker.addListener('click', () => {
      this.closeAllInfoWindows();
      infoWindow.open(this.map, marker);
    });
    this.infoWindows.push(infoWindow);
  }

  closeAllInfoWindows() {
    for (let window of this.infoWindows) {
      window.close();
    }
  }

  showMap() {
    const location = new google.maps.LatLng(-17.824858, 31.053028);
    const options = {
      center: location,
      zoom: 15,
      disableDefaultUI: true
    };
    this.map = new google.maps.Map(this.mapRef.nativeElement, options);
    this.addMarkersToMap(this.markers);
  }
}

interface Marker {
  title: string;
  latitude: string;
  longitude: string;
}
