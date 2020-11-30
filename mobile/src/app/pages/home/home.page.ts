/// <reference types="@types/googlemaps" />

import {
  Component,
  ElementRef,
  ViewChild,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { ToastController } from '@ionic/angular';
import { MapInfoWindow, MapMarker } from '@angular/google-maps';

@Component({
  selector: 'app-home-page',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})
export class HomePage implements OnInit {
  /** Tracks refresh state for the component */
  refresh$: BehaviorSubject<{
    latitude?: number;
    longitude?: number;
  }> = new BehaviorSubject({ latitude: 35, longitude: -78 });

  showSelectionUI = false;

  /** Draggable, editable rectangle that appears for selecting the Marker position. */
  selectionRectangle: google.maps.Rectangle;

  /** Tracks which Pin is currently selected for placement. */
  currentMenuKey: string;

  /** Tracks the center of the map displayed on the screen. */
  center = { lat: 0, lng: 0 };

  markerOptions = { draggable: false };

  options = { draggable: true, editable: true };

  markerPositions: google.maps.LatLngLiteral[] = [];

  zoom = 12;

  display?: google.maps.LatLngLiteral;

  bounds;

  constructor(
    private http: HttpClient,
    private toastController: ToastController,
    private settingsService: SettingsServiceMock,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const request = this.http.get('http://localhost:3000/pins');

    this.refresh$.subscribe(_ => {
      request.subscribe(data => {
        if (data) {
          this.markerPositions = []; // reset markers
          // this.initializeMap(lastPos.latitude ? lastPos : data[0]);
          this.addMarkersToMap(data);
        } else {
          // TODO: show message for no pins set, center map either at users location or at setting-defined location
        }
      });
    });
  }

  /**
   * Handles the Pin menu selection from a user.
   * If a user has location services on, place pin at their location [1],
   * otherwise, show a selection rectangle on the map [2].
   * @param key The menu item selected.
   * @docs-private
   */
  onMenuSelection(key: string) {
    this.currentMenuKey = key;

    if (this.settingsService.userHasLocationPermissions()) {
      if (navigator.geolocation) {
        // [1]
        navigator.geolocation.getCurrentPosition(
          (position: Position) => {
            const pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };

            this.center = pos;

            let latLng: google.maps.LatLng = new google.maps.LatLng(
              position.coords.latitude,
              position.coords.longitude
            );
            let mapMarker: google.maps.Marker = new google.maps.Marker({
              position: latLng,
              title: this.titleCase(key)
            });

            this.markerPositions.push(latLng.toJSON());

            this.onAdd();
          },
          e => {
            console.log('error', e);
          }
        );
      }
    } else {
      this.showSelectionUI = true;

      if (this.selectionRectangle) {
        this.selectionRectangle.setMap(null);
      }

      const sizeFactor = 0.005; // TODO: Have `sizeFactor` change based on zoom.

      const bounds: google.maps.LatLngBoundsLiteral = {
        north: this.center.lat,
        south: this.center.lat - sizeFactor,
        east: this.center.lng,
        west: this.center.lng - sizeFactor
      };

      this.bounds = bounds;

      this.selectionRectangle = new google.maps.Rectangle({
        bounds,
        editable: true,
        draggable: true
      });

      this.currentMenuKey = key;
    }
  }

  /**
   * Handles canceling Pin selection
   * @docs-private
   */
  onCancel() {
    this.resetUiState();
  }

  private resetUiState() {
    if (this.selectionRectangle) {
      this.selectionRectangle.setMap(null);
      this.selectionRectangle = null;
    }
    this.currentMenuKey = null;
    this.showSelectionUI = false;
  }

  /**
   * Handles the POST operation of a Pin after selection
   * @docs-private
   */
  onAdd() {
    let center;

    if (this.bounds) {
      center = this.bounds.north;
    } else {
      center = this.center;
    }

    const pin = {
      userId: '329e85ff-a699-4415-a9d8-118889e219ce',
      latitude: center.lat,
      longitude: center.lng,
      label: this.currentMenuKey
    };

    this.http.post('http://localhost:3000/pins', pin).subscribe(response => {
      if (response) {
        this.selectionRectangle && this.resetUiState();

        this.refresh$.next({
          latitude: pin.latitude,
          longitude: pin.longitude
        });
      }
    });

    this.presentToast(
      this.selectionRectangle
        ? `'${this.titleCase(
            this.currentMenuKey
          )}' pin placed at selected location.`
        : `'${this.titleCase(
            this.currentMenuKey
          )}' pin placed at your location.`
    );
  }

  /**
   * Presents a Toast on the screen with a given message.
   * @param message The message to display on the toast.
   */
  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2500
    });
    toast.present();
  }

  /**
   * Associate Markers to the Map
   * @param pins The Markers to associate
   * @docs-private
   */
  addMarkersToMap(pins) {
    let position = new google.maps.LatLng(pins[0].latitude, pins[0].longitude);

    this.center = position.toJSON();

    for (let marker of pins) {
      position = new google.maps.LatLng(marker.latitude, marker.longitude);

      this.markerPositions.push(position.toJSON());
    }

    // this.cdr.markForCheck();
  }

  addMarker(event: google.maps.MouseEvent) {
    this.markerPositions.push(event.latLng.toJSON());
  }

  // https://www.freecodecamp.org/news/three-ways-to-title-case-a-sentence-in-javascript-676a9175eb27/
  private titleCase(str): string {
    return str
      .toLowerCase()
      .split(' ')
      .map(function(word) {
        return word.replace(word[0], word[0].toUpperCase());
      })
      .join(' ');
  }
}

export class SettingsServiceMock {
  userHasLocationPermissions() {
    return false;
  }
}
