import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {FormControl, FormGroup} from '@angular/forms';

export interface EventDetails {
  name: string;
  details: string;
  startDate: any;
  endDate: any;
  allDay: boolean;
  id: string;
}

@Component({
  selector: 'app-add-event-dialog',
  templateUrl: './add-event-dialog.component.html',
  styleUrls: ['./add-event-dialog.component.css']
})
export class AddEventDialogComponent implements OnInit {
  eventForm: FormGroup;

  constructor(public dialogRef: MatDialogRef<AddEventDialogComponent>) { }

  ngOnInit() {
    this.eventForm = new FormGroup({
      name: new FormControl(),
      details: new FormControl(),
      startDate: new FormControl(),
      startTime: new FormControl(),
      endDate: new FormControl(),
      endTime: new FormControl(),
      allDay: new FormControl(false),
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
