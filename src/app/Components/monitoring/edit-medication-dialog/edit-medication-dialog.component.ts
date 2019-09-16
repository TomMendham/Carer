import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

export interface DialogData {
  name: string;
  dosage: string;
  instructions: string;
  purpose: string;
  expirationDate: any;
  prescriptionDate: any;
  prescribedBy: string;
  amount: string;
  id: string;
}

@Component({
  selector: 'app-edit-medication-dialog',
  templateUrl: './edit-medication-dialog.component.html',
  styleUrls: ['./edit-medication-dialog.component.css']
})
export class EditMedicationDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<EditMedicationDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
