import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';


export interface DialogData {
  name: string;
  details: string;
  startDate: any;
  startTime: any;
  endDate: any;
  endTime: any;
  allDay: boolean;
  id: string;
}

@Component({
  selector: 'app-edit-event-dialog',
  templateUrl: './edit-event-dialog.component.html',
  styleUrls: ['./edit-event-dialog.component.css']
})
export class EditEventDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<EditEventDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
