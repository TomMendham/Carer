import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FormControl, FormGroup, Validators} from '@angular/forms';

export interface Height {
  height: number;
  metric: string;
  date: any;
}

@Component({
  selector: 'app-height-dialog',
  templateUrl: './height-dialog.component.html',
  styleUrls: ['./height-dialog.component.css']
})
export class HeightDialogComponent implements OnInit {
  heightForm: FormGroup;

  constructor(public dialogRef: MatDialogRef<HeightDialogComponent>) { }

  ngOnInit() {
    this.heightForm = new FormGroup({
      metric: new FormControl(null, Validators.required),
      date: new FormControl(null, Validators.required),
      cm: new FormControl(null),
      ft: new FormControl(null),
      in: new FormControl(null),
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
