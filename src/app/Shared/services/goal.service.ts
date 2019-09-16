import {EventEmitter, Injectable, Output} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {Goal} from '../../Components/goal/goal.component';
import {Journal} from '../classes/journal.model';
import {UserDetails} from '../classes/user.model';

@Injectable({
  providedIn: 'root'
})
export class GoalService {
  goal: Goal = {
    name: '',
    assignee: '',
    details: '',
    milestones: [],
    completionDate: '',
    id: ''
  };

  @Output() goalLoader: EventEmitter<any> = new EventEmitter();

  constructor(public db: AngularFirestore) {
  }

  createGoal(goal: Goal, currentStoryboard) {
    this.db.collection('goal').doc(currentStoryboard)
      .collection('goals').add({
      name: goal.name,
      assignee: goal.assignee,
      details: goal.details,
      milestones: goal.milestones,
      completionDate: goal.completionDate,
    }).then(promise => {
      console.log(promise);
    });
  }

  getGoals(storyboardID: string) {
    this.db.collection('goal').doc(storyboardID)
      .collection('goals').ref.get().then(data => {
      data.forEach(doc => {
        this.goal.name = doc.data().name;
        this.goal.details = doc.data().details;
        this.goal.completionDate = doc.data().completionDate;
        this.goal.milestones = doc.data().milestones;
        this.goal.assignee = doc.data().assignee;
        this.goal.id = doc.id;
        this.goalLoader.emit(this.goal);
      });
    });
  }

  deleteGoals(storyboardID: string, goalID: string) {
    this.db.collection('goal').doc(storyboardID)
      .collection('goals').doc(goalID).delete();
  }

  editLog(goal: Goal, currentStoryboard: string) {
      this.db.collection('goal').doc(currentStoryboard)
        .collection('goals').doc(goal.id).update({
        name: goal.name,
        assignee: goal.assignee,
        details: goal.details,
        milestones: goal.milestones,
        completionDate: goal.completionDate,
        id: goal.id
      });
    }
}
