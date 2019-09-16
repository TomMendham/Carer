import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {MatDialogRef} from '@angular/material';

export interface Medication {
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
  selector: 'app-medication-dialog',
  templateUrl: './medication-dialog.component.html',
  styleUrls: ['./medication-dialog.component.css']
})
export class MedicationDialogComponent implements OnInit {
  medicationForm: FormGroup;
  isLinear: boolean;

  constructor(public dialogRef: MatDialogRef<MedicationDialogComponent>) { }

  ngOnInit() {
    this.medicationForm = new FormGroup({
      medicationDetails: new FormGroup( {
        name: new FormControl(),
        dosage: new FormControl(),
      }),
      information: new FormGroup({
        instructions: new FormControl(),
        purpose: new FormControl(),
        expirationDate: new FormControl(),
      }),
      prescriptionDetails: new FormGroup( {
        prescriptionDate: new FormControl(),
        prescribedBy: new FormControl(),
        amount: new FormControl(),
      })
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
