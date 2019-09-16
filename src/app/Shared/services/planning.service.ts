import {EventEmitter, Injectable, Output} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {EventDetails} from '../../Components/planner/add-event-dialog/add-event-dialog.component';
import {Medication} from '../../Components/monitoring/medication-dialog/medication-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class PlanningService {
  event: EventDetails = {
    name: '',
    details: '',
    startDate: '',
    endDate: '',
    allDay: false,
    id: ''
  };

  @Output() eventLoader: EventEmitter<any> = new EventEmitter();

  constructor(public db: AngularFirestore) { }

  createEvent(event: EventDetails, currentStoryboard: string) {
    this.db.collection('planner').doc(currentStoryboard).
    collection('events').add({
      name: event.name,
      details: event.details,
      startDate: event.startDate,
      endDate: event.endDate,
      allDay: event.allDay
    });
  }

  loadEvent(currentStoryboard: string) {
    this.db.collection('planner').doc(currentStoryboard).
    collection('events').ref.get().then(data => {
      data.forEach( doc => {
        this.event.name = doc.data().name;
        this.event.details = doc.data().details;
        this.event.startDate = doc.data().startDate;
        this.event.endDate = doc.data().endDate;
        this.event.allDay = doc.data().allDay;
        this.event.id = doc.id;
        this.eventLoader.emit(this.event);
      });
    });
  }

  deleteEventLog(eventID: string, currentStoryboard: string) {
    this.db.collection('planner').doc(currentStoryboard)
      .collection('events').doc(eventID).delete();
  }

  editEvent(event: EventDetails, currentStoryboard: string) {
    this.db.collection('planner').doc(currentStoryboard)
      .collection('events').doc(event.id).update({
      name: event.name,
      details: event.details,
      startDate: event.startDate,
      endDate: event.endDate,
      allDay: event.allDay,
      id: event.id
    });
  }
}
