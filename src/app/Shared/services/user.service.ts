import {EventEmitter, Injectable, Output} from '@angular/core';
import { User } from  'firebase';
import {AngularFirestore} from '@angular/fire/firestore';
import {UserDetails} from '../classes/user.model';
import * as firebase from 'firebase';
import {Storyboard} from '../classes/storyboard.model';

@Injectable({
  providedIn: 'root'
})

export class UserService {
  user: User;
  currentUser: UserDetails = {
    uid: '',
    name: '',
    email: '',
    bio: '',
    gender: '',
    jobDesc: '',
    dob: '',
    storyboards: [],
    currentStoryboard: ''}
  storyboard: Storyboard = {
    name: '',
    members: [],
    id: ''
  };

  @Output() storyboardChanged: EventEmitter<any> = new EventEmitter();
  @Output() userName: EventEmitter<any> = new EventEmitter();
  @Output() storyboardName: EventEmitter<any> = new EventEmitter();
  @Output() userChanged: EventEmitter<any> = new EventEmitter();
  private storyBoardArray: [];

  constructor(public db: AngularFirestore) {
  }

    getUserInformation() {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.db.collection('users').doc(this.user.uid).ref.get()
      .then(doc => {
        if (doc.exists) {
          this.currentUser.uid = doc.data().uid;
          this.currentUser.bio = doc.data().bio;
          this.currentUser.name = doc.data().name;
          this.currentUser.email = doc.data().email;
          this.currentUser.gender = doc.data().gender;
          this.currentUser.jobDesc = doc.data().jobDesc;
          this.currentUser.dob = doc.data().dob;
          this.currentUser.storyboards = doc.data().storyboards;
          this.currentUser.currentStoryboard = doc.data().currentStoryboard;
          this.userChanged.emit(this.currentUser);
        } else {
          console.log('no such document');
        }
      }).catch( error => {
      console.log(error);
    });
  }

  createStoryboard(storyName: string ) {
    const userStoryboard = this.currentUser.currentStoryboard;
    this.db.collection('storyboards').add({
      members: [this.user.uid],
      name: storyName,
    }).then(doc => {
      this.db.collection('users').doc(this.user.uid).update({
        storyboards: firebase.firestore.FieldValue.arrayUnion(doc.id),
      });
      if (!userStoryboard) {
        this.setCurrentStoryboard(doc.id);
      }
    });
  }

  getStoryboard() {
    for (const storyboard of this.currentUser.storyboards) {
      this.db.collection('storyboards').doc(storyboard).ref.get().then( doc => {
        this.storyboard.members = this.changeMembers(doc.data().members);
        this.storyboard.name = doc.data().name;
        this.storyboard.id = storyboard;
        this.storyboardChanged.emit(this.storyboard);
      });
    }
  }

  getStoryboardName(storyboardID: string) {
    this.db.collection('storyboards').doc(storyboardID).ref.get().then( doc => {
      const name = doc.data().name;
      this.storyboardName.emit(name);
    });
  }

  getUsername(userID: string) {
    let name = '';
    this.db.collection('users').doc(userID).ref.get().then( doc => {
      name = doc.data().name;
      console.log(name);
    });
    return name;
  }

  changeMembers(members: string[]) {
    const membersNames = [];

    members.forEach((member) => {
      this.db.collection('users').doc(member).ref.get().then( doc => {
        membersNames.push(doc.data().name);
      });
    });
    console.log(membersNames);
    return membersNames;
  }

  setCurrentStoryboard(storyboardID: any) {
    this.db.collection('users').doc(this.user.uid).update({
      currentStoryboard: storyboardID
    });
  }

  updateMember(storyboardID: string, memberID: string) {
    this.db.collection('users').doc(memberID).update({
      storyboards: firebase.firestore.FieldValue.arrayUnion(storyboardID)
      }).then( () => {
        this.db.collection('storyboards').doc(storyboardID).update({
        members: firebase.firestore.FieldValue.arrayUnion(memberID)
      });
    });
  }

  removeMember(storyboardID: string) {
    this.db.collection('users').doc(this.currentUser.uid).update( {
      storyboards: firebase.firestore.FieldValue.arrayRemove(storyboardID)
    }).then(() => {
      this.db.collection('storyboards').doc(storyboardID).update( {
        members: firebase.firestore.FieldValue.arrayRemove(this.currentUser.uid)
      });
    });

    if (this.currentUser.currentStoryboard === storyboardID) {
      this.setCurrentStoryboard(false);
    }
  }
}


