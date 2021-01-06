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
import {
  MapInfoWindow,
  MapMarker,
  MapRectangle,
  GoogleMap
} from '@angular/google-maps';

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
  }> = new BehaviorSubject({ latitude: null, longitude: null });
  showSelectionUI = false;
  /** Tracks which Pin is currently selected for placement. */
  currentMenuKey: string;
  /** Tracks the center of the map displayed on the screen. */
  center = { lat: 0, lng: 0 };
  markerOptions = { draggable: false };
  options = { draggable: true, editable: true };
  markerPositions: google.maps.LatLngLiteral[] = [];
  zoom = 12;
  bounds: google.maps.LatLngBoundsLiteral;

  @ViewChild(GoogleMap) map: GoogleMap;
  @ViewChild(MapRectangle) rectangle: MapRectangle;

  constructor(
    private http: HttpClient,
    private toastController: ToastController,
    private settingsService: SettingsServiceMock
  ) {}

  ngOnInit() {
    const request = this.http.get('http://localhost:3000/pins/');

    this.refresh$.subscribe(
      (lastPos: { latitude?: number; longitude?: number }) => {
        request.subscribe((data: IPin[]) => {
          if (data) {
            this.addMarkersToMap(data, lastPos);
          } else {
            // TODO: show message for no pins set, center map either at users location or at setting-defined location
          }
        });
      }
    );
  }

  /**
   * Associate Markers to the Map
   * @param pins The incoming pins
   * @param lastPos Last emitted position; Non-null if user has just added a pin.
   * @docs-private
   */
  addMarkersToMap(pins: IPin[], lastPos) {
    this.markerPositions = [];

    const position =
      lastPos && lastPos.latitude
        ? new google.maps.LatLng(lastPos.latitude, lastPos.longitude)
        : new google.maps.LatLng(pins[0].position.lat, pins[0].position.lng);

    this.markerPositions = pins.map(pin => {
      const { lat, lng } = pin.position;

      if (lat && lng) {
        return new google.maps.LatLng(lat, lng).toJSON();
      }
    });

    this.map.googleMap.setCenter(position || this.markerPositions[0]);
  }

  /**
   * Handles the Pin menu selection from a user.
   * If a user has location services on, place pin at their location,
   * otherwise, show a selection rectangle on the map.
   * @param key The menu item selected.
   * @docs-private
   */
  onMenuSelection(key: string) {
    this.currentMenuKey = key;

    if (this.settingsService.userHasLocationPermissions()) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position: Position) => {
            const pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };

            this.map.googleMap.setCenter(pos);

            this.onAdd(true);
          },
          e => {
            console.log('error', e);
          }
        );
      }
    } else {
      const center = this.map.getCenter();
      const sizeFactor = 0.005; // TODO: Have `sizeFactor` change based on zoom.

      this.bounds = {
        north: center.lat(),
        south: center.lat() - sizeFactor,
        east: center.lng(),
        west: center.lng() - sizeFactor
      };

      this.showSelectionUI = true;
      this.currentMenuKey = key;
    }
  }

  /**
   * Handles canceling Pin selection.
   * @docs-private
   */
  onCancel() {
    this.resetUiState();
  }

  /**
   * Resets all UI-related instance variables to component initialization behavior.
   * @docs-private
   */
  private resetUiState() {
    this.currentMenuKey = null;
    this.showSelectionUI = false;
  }

  /**
   * Handles the POST operation of a Pin after selection
   * @docs-private
   */
  onAdd(usingGeolocation: boolean) {
    const center = usingGeolocation
      ? this.map.getCenter()
      : this.rectangle.getBounds().getCenter();

    const pin = {
      userId: '394749694', // TODO: implement unique identifers per device (doesn't need to be from device, just unique to the device? idk, lots of security stuff to think about)
      lat: center.lat(),
      lng: center.lng(),
      label: this.currentMenuKey
    };

    this.http.post('http://localhost:3000/pins/', pin).subscribe(response => {
      if (response) {
        this.presentToast(
          this.settingsService.userHasLocationPermissions()
            ? `'${this.titleCase(
                this.currentMenuKey
              )}' pin placed at your location.`
            : `'${this.titleCase(
                this.currentMenuKey
              )}' pin placed at selected location.`
        );

        this.resetUiState();

        this.refresh$.next({
          latitude: pin.lat,
          longitude: pin.lng
        });
      }
    });
  }

  /**
   * Presents a Toast on the screen with a given message.
   * @param message The message to display on the toast.
   * @private
   */
  private async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2500
    });

    toast.present();
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

  locationChoice() {
    return 'choose';
  }
}

interface IPin {
  trackable: {
    createDate: Date;
    userId: number;
  };
  position: {
    lat: number;
    lng: number;
  };
  _id: string;
  label: string;
  showOnMap: boolean;
  imageUrl: string;
}
