import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material';
import {AddGoalDialogComponent} from './add-goal-dialog/add-goal-dialog.component';
import {FormArray, FormGroup} from '@angular/forms';
import {UserDetails} from '../../Shared/classes/user.model';
import {GoalService} from '../../Shared/services/goal.service';
import {UserService} from '../../Shared/services/user.service';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {map} from 'rxjs/operators';
import {Journal} from '../../Shared/classes/journal.model';
import {EditDialogComponent} from '../journal/edit-dialog/edit-dialog.component';
import {EditGoalDialogComponent} from './edit-goal-dialog/edit-goal-dialog.component';

export interface Goal {
  name: string;
  assignee: string;
  details: string;
  milestones: any[];
  completionDate: any;
  id: string;
}

@Component({
  selector: 'app-goal',
  templateUrl: './goal.component.html',
  styleUrls: ['./goal.component.css']
})
export class GoalComponent implements OnInit, OnDestroy {
  goalForm: FormGroup;
  goal: Goal = {
    name: '',
    assignee: '',
    details: '',
    milestones: [],
    completionDate: '',
    id: ''
  };
  user: UserDetails;
  userSubscription;
  goalSubscription;
  goalArray = [];
  cols = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return 1;
      }
      return 2;
    })
  );

  constructor(public dialog: MatDialog, public goalService: GoalService, public userService: UserService, private breakpointObserver: BreakpointObserver) { }

  ngOnInit() {
    this.userSubscription = this.userService.userChanged.subscribe(isUser => {
      this.user = isUser;
    });
    setTimeout(() => {
      this.loadGoals();
    }, 1000);
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
    this.goalSubscription.unsubscribe();
  }

  openAddGoalDialog(): void {
    const dialogRef = this.dialog.open(AddGoalDialogComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe(result => {
      this.goalForm = result;
      let arrayControl: FormArray;

      if (this.goalForm != null) {
        this.goal.name = this.goalForm.get('name').value.toString();
        this.goal.details = this.goalForm.get('details').value.toString();
        this.goal.assignee = this.goalForm.get('assignee').value.toString();
        arrayControl = this.goalForm.get('milestones') as FormArray;
        for (const milestone of arrayControl.controls) {
          this.goal.milestones.push(milestone.value);
        }
        this.goal.completionDate = this.goalForm.get('completionDate').value;
        this.goalService.createGoal(this.goal, this.user.currentStoryboard);
        this.reloadData();
      }
    });
  }

  loadGoals() {
    const array = [];
    this.goalService.getGoals(this.user.currentStoryboard);
    this.goalSubscription = this.goalService.goalLoader.subscribe( isGoal => {
      console.log(isGoal);
      array.push({
        name: isGoal.name,
        details: isGoal.details,
        assignee: isGoal.assignee,
        completionDate: isGoal.completionDate.toDate(),
        milestones: isGoal.milestones,
        id: isGoal.id
      });
    });
    this.goalArray = array;
  }

  onDelete(id: string) {
    this.goalService.deleteGoals(this.user.currentStoryboard, id);
    this.reloadData();
  }

  openEditDialog(goal: Goal): void {
    const array = goal.milestones;
    const dialogRef = this.dialog.open(EditGoalDialogComponent, {
      width: '500px',
      data: {name: goal.name,
      details: goal.details,
      assignee: goal.assignee,
      completionDate: goal.completionDate,
      milestones: array,
      id: goal.id}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('the dialog was closed');
      this.goal = result;
      if (this.goal != null) {
        this.goalService.editLog(this.goal, this.user.currentStoryboard);
        this.reloadData();
      } else {
        console.log('you left it empty');
      }
    });
  }

  reloadData() {
    this.userSubscription.unsubscribe();
    this.goalSubscription.unsubscribe();
    this.loadGoals();
  }


}
