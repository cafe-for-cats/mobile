import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { JwtService } from 'src/app/services/jwt.service';
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
    private jwtService: JwtService,
    public modalController: ModalController,
    public toastController: ToastController,
    private dataService: ProtestsDataService
  ) {
    this.addResult$ = this.dataService.receiveCreateProtest();
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      protestCode: [null, Validators.required],
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
    const userId = this.jwtService.token.user.id;

    this.dataService.requestCreateProtest({
      protestCode: this.protestCode.value,
      userId,
    });
  }

  get protestCode() {
    return this.form.get('protestCode');
  }

  async presentToast(msg: string, durationSec: number) {
    const toast = await this.toastController.create({
      message: msg,
      duration: durationSec,
    });
    toast.present();
  }
}
