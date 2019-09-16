import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-add-goal-dialog',
  templateUrl: './add-goal-dialog.component.html',
  styleUrls: ['./add-goal-dialog.component.css']
})
export class AddGoalDialogComponent implements OnInit {
  goalForm: FormGroup;

  constructor(public dialogRef: MatDialogRef<AddGoalDialogComponent>, private fb: FormBuilder) { }

  ngOnInit() {
  this.goalForm = this.fb.group({
    name: [''],
    assignee: [''],
    details: [''],
    milestones: this.fb.array([this.fb.control('')]),
    completionDate: ['']
  });
    }

  addMilestone() {
    this.milestones.push(this.fb.control(''));
  }

  get milestones() {
    return this.goalForm.get('milestones') as FormArray;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
