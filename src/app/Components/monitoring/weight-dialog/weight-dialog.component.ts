import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialogRef} from '@angular/material';

export interface Weight {
  weight: number;
  metric: string;
  date: any;
}

@Component({
  selector: 'app-weight-dialog',
  templateUrl: './weight-dialog.component.html',
  styleUrls: ['./weight-dialog.component.css']
})
export class WeightDialogComponent implements OnInit {
  weightForm: FormGroup;

  constructor(public dialogRef: MatDialogRef<WeightDialogComponent>) { }

  ngOnInit() {
    this.weightForm = new FormGroup({
      metric: new FormControl(null, Validators.required),
      date: new FormControl(null, Validators.required),
      weight: new FormControl(null, Validators.required)
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
