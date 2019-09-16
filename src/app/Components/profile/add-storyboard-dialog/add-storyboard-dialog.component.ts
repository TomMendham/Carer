import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-add-storyboard-dialog',
  templateUrl: './add-storyboard-dialog.component.html',
  styleUrls: ['./add-storyboard-dialog.component.css']
})
export class AddStoryboardDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<AddStoryboardDialogComponent>) { }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
