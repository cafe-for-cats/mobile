import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { accessLevels, ProtestsDataService } from '../protests-data.service';

@Component({
  selector: 'app-my-protests',
  templateUrl: './my-protests.component.html',
  styleUrls: ['./my-protests.component.scss'],
})
export class MyProtestsComponent implements OnInit {
  data$: Observable<{}>;
  protestsData: any = [];
  attendingProtests: any = [];
  leaderLevel = accessLevels.Leader;
  chipViewCondition: number;

  constructor(private dataService: ProtestsDataService) {
    this.data$ = this.dataService.receiveGetProtestsForUser();
  }

  ngOnInit() {
    this.dataService.requestGetProtestsForUser();

    this.data$.subscribe((result) => {
      this.protestsData = result;
      console.log('subscribed data: ', this.protestsData);
    });

    this.chipViewCondition = 0;
  }

  onClickLog() {
    console.log('button clicked');
  }

  onClickChip(chip) {
    this.chipViewCondition = chip;
    console.log(this.chipViewCondition);
  }
}
