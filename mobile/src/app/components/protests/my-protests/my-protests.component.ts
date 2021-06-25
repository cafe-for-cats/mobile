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
  chipViewCondition: number;

  adminLevel = accessLevels.Admin;
  leaderLevel = accessLevels.Leader;
  organizerLevel = accessLevels.Organizer;
  attendeeLevel = accessLevels.Attendee;
  unassignedLevel = accessLevels.Unassigned;

  constructor(private dataService: ProtestsDataService) {
    this.data$ = this.dataService.receiveGetProtestsForUser();
  }

  ngOnInit() {
    this.dataService.requestGetProtestsForUser();

    this.data$.subscribe((result) => {
      this.protestsData = result;
    });

    this.chipViewCondition = 0;
  }

  onClickChip(chip) {
    this.chipViewCondition = chip;
  }
}
