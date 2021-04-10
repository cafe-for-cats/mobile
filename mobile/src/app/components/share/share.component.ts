import { Component, OnInit } from '@angular/core';
import { ProtestDataService } from 'src/app/services/protest-data.service';

@Component({
  selector: 'app-share',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.scss'],
})
export class ShareComponent implements OnInit {
  link$;

  constructor(private protestDataService: ProtestDataService) {}

  ngOnInit() {}

  getOrganizerLink() {
    this.link$ = this.protestDataService.protests.subscribe(
      (res) => res.shareUrls
    );

    this.protestDataService.emitRequest();
  }
}
