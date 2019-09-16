import {Component, Inject, OnInit} from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';


export interface DialogData {
  memberID: string;
  storyboardID: string;
}

@Component({
  selector: 'app-invite-dialog',
  templateUrl: './invite-dialog.component.html',
  styleUrls: ['./invite-dialog.component.css']
})
export class InviteDialogComponent {

constructor(public dialogRef: MatDialogRef<InviteDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

onNoClick(): void {
  this.dialogRef.close();
}

}
