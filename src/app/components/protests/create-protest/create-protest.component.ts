import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { JwtService } from 'src/app/services/jwt.service';
import { ProtestsDataService } from '../protests-data.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-create-protest',
  templateUrl: './create-protest.component.html',
})
export class CreateProtestComponent implements OnInit {
  form: FormGroup;
  data$: Observable<{}>;
  addResult$: Observable<{ status: boolean }>;
  protestAdded$: Observable<any>;
  minDate: String;
  geocoder: google.maps.Geocoder;

  constructor(
    private formBuilder: FormBuilder,
    private jwtService: JwtService,
    public modalController: ModalController,
    public toastController: ToastController,
    private dataService: ProtestsDataService
  ) {
    this.geocoder = new google.maps.Geocoder();

    this.data$ = this.dataService.receiveGetProtestsForUser();
    this.addResult$ = this.dataService.receiveCreateProtest();
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      title: [null, Validators.required],
      description: [null, Validators.required],
      startDate: [null, Validators.required],
      location: null,
    });

    this.minDate = this.setMinDate();

    this.addResult$.subscribe((result) => {
      if (result.status) {
        this.presentToast('Success! Form has been submitted.');
      } else {
        this.presentToast('Oh no! Something went wrong...');
      }
    });
  }

  async presentToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
    });

    toast.present();
  }

  async onSubmit() {
    this.dataService.requestCreateProtest({
      title: this.title,
      description: this.description,
      startDate: this.startDate,
      userId: this.jwtService.token.user.id,
      location: await this.location,
    });
  }

  /** Get the `location` input from the form and geocode it before passing to the server. */
  get location() {
    return (async () => {
      try {
        const result: google.maps.GeocoderResult[] = await findPlaceFromQuery(
          this.geocoder,
          this.form.get('location').value
        );

        return {
          lat: result[0].geometry.location.lat(),
          lng: result[0].geometry.location.lng(),
          simpleName: result[0].formatted_address,
          fullName: result[0].address_components,
        };
      } catch (e) {
        console.log(e);

        return null;
      }
    })();
  }

  get title() {
    return this.form.get('title').value;
  }

  get description() {
    return this.form.get('description').value;
  }

  get startDate() {
    return this.form.get('startDate').value;
  }

  setMinDate() {
    //format 2021-01-16T19:20+01:00 --> YYYY-MM-DD
    let date = new Date();
    let YYYY = date.getFullYear();
    let MM = '0' + (date.getMonth() + 1).toString().slice(-2);
    let DD = ('0' + date.getDate().toString()).slice(-2);
    let currentDateTime = `${YYYY}-${MM}-${DD}`;

    return currentDateTime;
  }
}

/** Wraps the google maps `findPlaceFromQuery` in a Promise-based result. */
async function findPlaceFromQuery(
  geocoder: google.maps.Geocoder,
  address
): Promise<google.maps.GeocoderResult[]> {
  return new Promise((resolve, reject) => {
    geocoder.geocode({ address }, (response, status) => {
      if (status === google.maps.GeocoderStatus.ZERO_RESULTS) resolve([]);

      if (status === google.maps.GeocoderStatus.OK) resolve(response);

      if (status !== google.maps.GeocoderStatus.OK)
        reject('Something went wrong!');
    });
  });
}

export interface Protest {
  _id: string;
  title: string;
  description: string;
  associatedUsers: { _id: string; accessLevel: string };
}
