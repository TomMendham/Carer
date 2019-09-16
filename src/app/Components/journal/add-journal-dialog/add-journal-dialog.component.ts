import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-add-journal-dialog',
  templateUrl: './add-journal-dialog.component.html',
  styleUrls: ['./add-journal-dialog.component.css']
})
export class AddJournalDialogComponent implements OnInit {
  journalForm: FormGroup;

  constructor(public dialogRef: MatDialogRef<AddJournalDialogComponent>) { }

  ngOnInit() {
    this.journalForm = new FormGroup({
      name: new FormControl(null, Validators.required),
      text: new FormControl(null, Validators.required),
      topic: new FormControl( null, Validators.required)
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
