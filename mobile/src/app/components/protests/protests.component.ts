import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ModalPage } from '../modal/modal.page';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { JwtService } from 'src/app/services/jwt.service';
import { ProtestsDataService } from './protests-data.service';

@Component({
  selector: 'app-protests',
  templateUrl: './protests.component.html',
  styleUrls: ['./protests.component.scss'],
})
export class ProtestsComponent implements OnInit {
  form = this.formBuilder.group({
    title: [null, Validators.required],
    description: [null, Validators.required],
  });

  data$: Observable<{}>;
  addResult$: Observable<{ status: boolean }>;

  protestAdded$: Observable<any>;

  constructor(
    private formBuilder: FormBuilder,
    private jwtService: JwtService,
    public modalController: ModalController,
    private dataService: ProtestsDataService
  ) {
    this.data$ = this.dataService.receiveGetProtestsForUser();
    this.addResult$ = this.dataService.receiveCreateProtest();
  }

  ngOnInit() {
    const userId = this.jwtService.token.user.id;
    const baseUrl = 'http://localhost:3000/protests/getProtestsView';

    this.dataService.requestGetProtestsForUser(); //emits the websocket -> grabs data
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: ModalPage,
    });
    return await modal.present();
  }

  onSubmit() {
    const userId = this.jwtService.token.user.id;
    const baseUrl = 'http://localhost:3000/protests/add';

    this.dataService.requestCreateProtest({
      title: this.title.value,
      description: this.description.value,
      creatorId: userId,
    });
  }

  get title() {
    return this.form.get('title');
  }

  get description() {
    return this.form.get('description');
  }
}

export interface Protest {
  _id: string;
  title: string;
  description: string;
  associatedUsers: { _id: string; accessLevel: string };
}
