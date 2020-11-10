import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-google-maps',
  templateUrl: './google-maps.component.html',
  styleUrls: ['./google-maps.component.scss']
})
export class GoogleMapsComponent implements OnChanges {
  @Input() data: any;

  private data$: BehaviorSubject<any> = new BehaviorSubject(null);

  /** The component responsible for creating the Map within an HTML Element */
  map: google.maps.Map;

  /** Each pop-up window that provides additional information about a marker */
  infoWindows: google.maps.InfoWindow[] = [];

  /** Tracks which info window is currently open */
  openedInfoWindows: google.maps.InfoWindow[] = [];

  @ViewChild('map', { read: ElementRef, static: false }) mapRef: ElementRef;

  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.data.previousValue !== changes.data.currentValue) {
      this.data$.next(this.data);
    }

    this.data$.subscribe(data => {
      if (data) {
        this.showMap(data[0]);
        this.addMarkersToMap(data);
      } else {
        // TODO: show message for no pins set
      }
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
