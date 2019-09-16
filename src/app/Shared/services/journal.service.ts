import {EventEmitter, Injectable, Output} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {Journal} from '../classes/journal.model';
import {UserService} from './user.service';
import {UserDetails} from '../classes/user.model';
import * as firebase from 'firebase';
import {User} from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class JournalService {
  journal: Journal = {
    name: '',
    text: '',
    topic: '',
    timestamp: '',
    creator: '',
    id: ''
  };
  @Output() logLoader: EventEmitter<any> = new EventEmitter();
  index = 0;

  constructor(public db: AngularFirestore) {
      }

   createLog(journal: Journal, user: UserDetails) {
    this.db.collection('journal').doc(user.currentStoryboard)
      .collection('logs').add({
      name: journal.name,
      text: journal.text,
      topic: journal.topic,
      creator: user.uid,
      timestamp: firebase.firestore.Timestamp.now()
    });
  }

  getLogs(storyboardID: string) {
    this.index += 1;
    this.db.collection('journal').doc(storyboardID)
      .collection('logs').ref.get().then(data => {
        data.forEach( doc => {
          this.journal.name = doc.data().name;
          this.journal.topic = doc.data().topic;
          this.journal.text = doc.data().text;
          this.journal.timestamp = doc.data().timestamp;
          this.journal.creator = doc.data().creator;
          this.journal.id = doc.id;
          this.logLoader.emit(this.journal);
        });
    });
  }

  editLog(journal: Journal, user: UserDetails) {
    this.db.collection('journal').doc(user.currentStoryboard)
      .collection('logs').doc(journal.id).update({
      name: journal.name,
      text: journal.text,
      topic: journal.topic,
      creator: journal.creator,
      timestamp: journal.timestamp,
      id: journal.id
    });
  }

  deleteLog(journalID: string, currentStoryboard: string) {
    this.db.collection('journal').doc(currentStoryboard)
      .collection('logs').doc(journalID).delete();
  }
}

