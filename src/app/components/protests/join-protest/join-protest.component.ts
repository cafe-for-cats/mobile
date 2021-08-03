import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { ProtestsDataService } from '../protests-data.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-join-protest',
  templateUrl: './join-protest.component.html',
})
export class JoinProtestComponent implements OnInit {
  form: FormGroup;
  data$: Observable<{}>;
  addResult$: Observable<{ status: boolean }>;
  protestAdded$: Observable<any>;

  constructor(
    private formBuilder: FormBuilder,
    public modalController: ModalController,
    public toastController: ToastController,
    private dataService: ProtestsDataService
  ) {
    this.addResult$ = this.dataService.receiveCreateProtest();
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      protestToken: [null, Validators.required],
    });

    this.addResult$.subscribe((result) => {
      if (result.status) {
        this.presentToast('Success! Form has been submitted.', 2000);
      } else {
        this.presentToast('Oh no! Something went wrong...', 2000);
      }
    });
  }

  onSubmit() {
    this.dataService
      .getProtestByShareToken(this.protestToken.value)
      .subscribe((result: ProtestResponse) => {
        if (result.status) {
          this.presentToast(
            'Joining waitlist. Check "My Protests" to view your status.',
            3000
          );
          this.dataService.postJoinProtest(result.payload[0]._id);
        } else {
          this.presentToast(result.message, 2000);
        }
      });
  }

  get protestToken() {
    return this.form.get('protestToken');
  }

  async presentToast(msg: string, durationSec: number) {
    const toast = await this.toastController.create({
      message: msg,
      duration: durationSec,
    });
    toast.present();
  }
}

interface ProtestResponse {
  status: boolean;
  message: string;
  payload: {
    _id: string;
  };
}
