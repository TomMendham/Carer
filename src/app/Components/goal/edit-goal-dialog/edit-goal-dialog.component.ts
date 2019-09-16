import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

export interface DialogData {
  name: string;
  assignee: string;
  details: string;
  milestones: any[];
  completionDate: any;
  id: string;
}

@Component({
  selector: 'app-edit-goal-dialog',
  templateUrl: './edit-goal-dialog.component.html',
  styleUrls: ['./edit-goal-dialog.component.css']
})
export class EditGoalDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<EditGoalDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onRemove(milestone: string) {
    this.data.milestones = this.data.milestones.filter(e => e !== milestone);
    console.log(this.data.milestones);
  }
}
