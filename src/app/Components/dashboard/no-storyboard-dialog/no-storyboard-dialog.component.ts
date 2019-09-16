import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-no-storyboard-dialog',
  templateUrl: './no-storyboard-dialog.component.html',
  styleUrls: ['./no-storyboard-dialog.component.css']
})
export class NoStoryboardDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<NoStoryboardDialogComponent>) { }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
