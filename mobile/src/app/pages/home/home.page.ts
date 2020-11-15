/// <reference types="@types/googlemaps" />

import {
  Component,
  ElementRef,
  ViewChild,
  SimpleChanges,
  EventEmitter,
  OnInit
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, of, combineLatest } from 'rxjs';
import { switchMap, startWith, filter, shareReplay } from 'rxjs/operators';

@Component({
  selector: 'app-home-page',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})
export class HomePage implements OnInit {
  /** Tracks refresh state for the component */
  refresh$: BehaviorSubject<any> = new BehaviorSubject(true);

  /** The component responsible for creating the Map within an HTML Element. */
  map: google.maps.Map;

  /** Draggable, editable rectangle that appears for selecting the Marker position. */
  selectionRectangle: google.maps.Rectangle;

  /** Each pop-up window that provides additional information about a marker. */
  infoWindows: google.maps.InfoWindow[] = [];

  /** Tracks which info window is currently open. */
  openedInfoWindow: google.maps.InfoWindow = null;

  /** Tracks which Pin is currently selected for placement. */
  currentMenuKey: string;

  /** Contains the Google Map element ref. */
  @ViewChild('map', { read: ElementRef, static: false }) mapRef: ElementRef;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    const request = this.http.get('http://localhost:3000/pins');

    this.refresh$.subscribe(() => {
      request.subscribe(data => {
        if (data) {
          this.initializeMap(data[0]);
          this.addMarkersToMap(data);
        } else {
          // TODO: show message for no pins set
        }
      });
    });
  }

  paramsChanged(key: string) {
    if (this.selectionRectangle) {
      this.selectionRectangle.setMap(null);
    }

    const center = this.map.getCenter();
    const sizeFactor = 0.005; // TODO: Have `sizeFactor` change based on zoom.

    const bounds = {
      north: center.lat(),
      south: center.lat() - sizeFactor,
      east: center.lng(),
      west: center.lng() - sizeFactor
    };

    this.selectionRectangle = new google.maps.Rectangle({
      bounds: bounds,
      editable: true,
      draggable: true
    });

    this.currentMenuKey = key;

    this.selectionRectangle.setMap(this.map);
  }

  onCancel() {
    this.selectionRectangle.setMap(null);
    this.selectionRectangle = null;
    this.currentMenuKey = null;
  }

  onAdd() {
    const center = this.selectionRectangle.getBounds().getCenter();
    const pin = {
      userId: '329e85ff-a699-4415-a9d8-118889e219ce',
      latitude: center.lat(),
      longitude: center.lng(),
      label: this.currentMenuKey
    };

    this.http.post('http://localhost:3000/pins', pin).subscribe(response => {
      if (response) {
        this.selectionRectangle.setMap(null);
        this.selectionRectangle = null;
        this.currentMenuKey = null;

        this.refresh$.next(true);
      }
    });
  }

  initializeMap(position) {
    const options = {
      center: new google.maps.LatLng(position.latitude, position.longitude),
      zoom: 15,
      disableDefaultUI: true
    };

    this.map = new google.maps.Map(this.mapRef.nativeElement, options);
  }

  addMarkersToMap(markers) {
    for (let marker of markers) {
      let position: google.maps.LatLng = new google.maps.LatLng(
        marker.latitude,
        marker.longitude
      );
      let mapMarker: google.maps.Marker = new google.maps.Marker({
        position: position,
        title: this.titleCase(marker.label)
      });

      mapMarker.setMap(this.map);
      this.addInfoWindowToMarker(mapMarker);
    }
  }

  // https://www.freecodecamp.org/news/three-ways-to-title-case-a-sentence-in-javascript-676a9175eb27/
  private titleCase(str) {
    return str
      .toLowerCase()
      .split(' ')
      .map(function(word) {
        return word.replace(word[0], word[0].toUpperCase());
      })
      .join(' ');
  }

  addInfoWindowToMarker(marker: google.maps.Marker) {
    const pos = marker.getPosition();
    let infoWindowContent = `
      <div style="color: black" id="content"> 
        <h2 id="firstHeading" class="firstHeading"> ${marker.getTitle()} </h2>
        <p>Latitude: ${pos.lat()} </p>
        <p>Longitude: ${pos.lng()} </p> 
      </div>
    `;

    let infoWindow = new google.maps.InfoWindow({
      content: infoWindowContent
    });

    marker.addListener('click', () => {
      this.openedInfoWindow && this.openedInfoWindow.close();

      infoWindow.open(this.map, marker);
      this.openedInfoWindow = infoWindow;
    });
    this.infoWindows.push(infoWindow);
  }
}

interface Pin {
  pin_id: string;
  user_id: string;
  latitude: number;
  longitude: number;
  label: string;
  create_date?: Date;
}
