import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {PlanningService} from '../../../Shared/services/planning.service';
import {EventDetails} from '../add-event-dialog/add-event-dialog.component';
import {EditEventDialogComponent} from '../edit-event-dialog/edit-event-dialog.component';
import {UserService} from '../../../Shared/services/user.service';
import {UserDetails} from '../../../Shared/classes/user.model';

export interface DialogData {
  name: string;
  details: string;
  startDate: any;
  endDate: any;
  allDay: any;
  id: string;
}

@Component({
  selector: 'app-view-event-dialog',
  templateUrl: './view-event-dialog.component.html',
  styleUrls: ['./view-event-dialog.component.css']
})
export class ViewEventDialogComponent implements OnInit, OnDestroy {
  event: EventDetails = {
    name: '',
    details: '',
    startDate: '',
    endDate: '',
    allDay: false,
    id: ''
  };

  user: UserDetails;
  private userSubscription: any;

  constructor(public dialog: MatDialog,
              public dialogRef: MatDialogRef<ViewEventDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData,
              public  planningService: PlanningService,
              public userService: UserService
              ) { }

  ngOnInit() {
    this.userService.getUserInformation();
    this.userSubscription = this.userService.userChanged.subscribe(isUser => {
      this.user = isUser;
    });
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  openEditEventDialog(event: EventDetails): void {
    const dialogRef = this.dialog.open(EditEventDialogComponent, {
      width: '500px',
      data: {
        name: event.name,
        details: event.details,
        startDate: event.startDate,
        startTime: event.startDate.getTime(),
        endDate: event.endDate,
        endTime: event.endDate.getTime(),
        allDay: event.allDay,
        id: event.id
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.event = result;
        this.planningService.editEvent(this.event , this.user.currentStoryboard);
      }
    });
  }


}
