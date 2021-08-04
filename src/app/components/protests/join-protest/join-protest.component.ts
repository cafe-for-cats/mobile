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
    /*
    TODO: non subscribe solution
    return this.dataService
      .getProtestByShareToken(this.protestToken.value)
      .pipe(
        switchMap((result: ProtestResponse) =>
          this.dataService.postJoinProtest(result.payload[0]._id)
        ),
        tap((result: PostResult) => {
          if (result.status) {
            this.presentToast(result.message, 2000);
          } else {
            this.presentToast('This token does not exist.', 2000);
          }
        })
      );
      */

    this.dataService.getProtestByShareToken(this.protestToken.value).subscribe(
      (result: ProtestResponse) => {
        if (result) {
          this.dataService
            .postJoinProtest(result.payload[0]._id)
            .subscribe((result: PostResult) => {
              if (result.payload != null) {
                console.log('true');
                this.presentToastWithClose(
                  'Joined protest waiting list. Check "My-Protest" for your status.',
                  true
                );
              } else {
                console.log('false');
                this.presentToastWithClose(result.message, false);
              }
            });
        } else {
          this.presentToastWithClose('Invalid token', false);
        }
      },
      (err) => {
        console.log(err);
        this.presentToastWithClose(
          'error:' + err.status + ' Check console for more information.',
          false
        );
      }
    );
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

  async presentToastWithClose(msg: string, success: boolean) {
    console.log('presentToast ran');
    const color = success ? 'success' : 'danger';

    const toast = await this.toastController.create({
      color: color,
      message: msg,
      buttons: [
        {
          text: 'close',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          },
        },
      ],
    });

    await toast.present();
  }
}

interface ProtestResponse {
  status: boolean;
  message: string;
  payload: {
    _id: string;
  };
}
interface PostResult {
  status: boolean;
  message: string;
  payload: {
    _id: string;
  };
}
