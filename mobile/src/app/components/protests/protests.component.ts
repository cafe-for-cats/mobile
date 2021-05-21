import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { JwtService } from 'src/app/services/jwt.service';
import { ProtestsDataService } from './protests-data.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-protests',
  templateUrl: './protests.component.html',
  styleUrls: ['./protests.component.scss'],
})
export class ProtestsComponent implements OnInit {
  form = this.formBuilder.group({
    title: [null, Validators.required],
    description: [null, Validators.required],
    startDate: [null, Validators.required],
  });

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
    const userId = this.jwtService.token.user.id;
    const baseUrl = 'http://localhost:3000/protests/getProtestsView';
    this.minDate = this.setMinDate();

    this.dataService.requestGetProtestsForUser(); //emits the websocket -> grabs data

    this.addResult$.subscribe((result) => {
      if (result.status) {
        this.presentToast('Success! Form has been submitted.');
      } else {
        this.presentToast('Oh no! Something went wrong...');
      }
    });
  }

  async presentToast(msg) {
    if (typeof msg !== 'string') {
      msg = msg.toString();
    }
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
    });
    toast.present();
  }

  onSubmit() {
    const userId = this.jwtService.token.user.id;
    const baseUrl = 'http://localhost:3000/protests/add';

    this.dataService.requestCreateProtest({
      title: this.title.value,
      description: this.description.value,
      startDate: this.startDate.value,
      creatorId: userId,
    });
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
    let DD = date.getDate();
    let currentDateTime = `${YYYY}-${MM}-${DD}`;

    console.log('setMinDate has been called:', currentDateTime);
    return currentDateTime;

    /* for YYYY-MM-DDDTHH:MMformat ex: 2021-01-16T19:20+01:00
    let HH = date.getHours();
    let Mn = date.getMinutes();
    let currentDateTime = `${YYYY}-${MM}-${DD}T${HH}:${Mn}`; */
  }
}

export interface Protest {
  _id: string;
  title: string;
  description: string;
  associatedUsers: { _id: string; accessLevel: string };
}
