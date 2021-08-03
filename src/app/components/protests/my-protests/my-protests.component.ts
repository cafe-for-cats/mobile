import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { accessLevels, ProtestsDataService } from '../protests-data.service';

@Component({
  selector: 'app-my-protests',
  templateUrl: './my-protests.component.html',
  styleUrls: ['./my-protests.component.scss'],
})
export class MyProtestsComponent implements OnInit {
  format = 'dd/MM/yyyy hh:mm:ss';
  data$: Observable<{}>;
  protestsData: any = [];
  chipViewCondition: ChipViewType;
  segmentViewCondition: SegmentViewType;

  adminLevel = accessLevels.Admin;
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
      console.log(result);
    });

    this.chipViewCondition = 'all';
    this.segmentViewCondition = 'active';
  }

  segmentChanged(ev: any) {
    this.segmentViewCondition = ev.target.value;
  }

  onClickChip(chip: ChipViewType) {
    this.chipViewCondition = chip;
  }
}

type ChipViewType = 'organizing' | 'attending' | 'all';
type SegmentViewType = 'active' | 'pending' | 'archived';
