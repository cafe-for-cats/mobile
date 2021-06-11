import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { JwtService } from 'src/app/services/jwt.service';
import { ProtestsDataService } from '../protests/protests-data.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-create-protest',
  templateUrl: './create-protest.component.html',
  styleUrls: ['./create-protest.component.scss'],
})
export class CreateProtestComponent implements OnInit {
  form: FormGroup;
  data$: Observable<{}>;
  addResult$: Observable<{ status: boolean }>;
  protestAdded$: Observable<any>;
  minDate: String;

  constructor(
    private formBuilder: FormBuilder,
    private jwtService: JwtService,
    public modalController: ModalController,
    public toastController: ToastController,
    private dataService: ProtestsDataService
  ) {
    this.data$ = this.dataService.receiveGetProtestsForUser();
    this.addResult$ = this.dataService.receiveCreateProtest();
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      title: [null, Validators.required],
      description: [null, Validators.required],
      startDate: [null, Validators.required],
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

  onSubmit() {
    const userId = this.jwtService.token.user.id;

    this.dataService.requestCreateProtest({
      title: this.title.value,
      description: this.description.value,
      startDate: this.startDate.value,
      userId,
    });
  }

  logThis(x) {
    console.log(x); //testing purposes
  }

  get title() {
    return this.form.get('title');
  }
  get description() {
    return this.form.get('description');
  }
  get startDate() {
    return this.form.get('startDate');
  }

  setMinDate() {
    //format 2021-01-16T19:20+01:00 --> YYYY-MM-DD
    let date = new Date();
    let YYYY = date.getFullYear();
    let MM = '0' + (date.getMonth() + 1).toString().slice(-2);
    let DD = ('0' + date.getDate().toString()).slice(-2);
    let currentDateTime = `${YYYY}-${MM}-${DD}`;

    console.log(currentDateTime);
    return currentDateTime;
  }
}

export interface Protest {
  _id: string;
  title: string;
  description: string;
  associatedUsers: { _id: string; accessLevel: string };
}
