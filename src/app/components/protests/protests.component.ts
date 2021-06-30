import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { ProtestsDataService } from './protests-data.service';
import { ToastController } from '@ionic/angular';
@Component({
  selector: 'app-protests',
  templateUrl: './protests.component.html',
})
export class ProtestsComponent implements OnInit {
  data$: Observable<{}>;
  addResult$: Observable<{ status: boolean }>;
  protestAdded$: Observable<any>;

  constructor(
    public modalController: ModalController,
    public toastController: ToastController,
    private dataService: ProtestsDataService
  ) {
    this.data$ = this.dataService.receiveGetProtestsForUser();
    this.addResult$ = this.dataService.receiveCreateProtest();
  }

  ngOnInit() {
    this.dataService.requestGetProtestsForUser();
  }
}

export interface Protest {
  _id: string;
  title: string;
  description: string;
  associatedUsers: { _id: string; accessLevel: string };
}
