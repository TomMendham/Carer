import { Injectable } from '@angular/core';
import { Router } from  '@angular/router';
import { AngularFireAuth } from  '@angular/fire/auth';
import { User } from  'firebase';
import {AngularFirestore} from '@angular/fire/firestore';
import {RegisterUser} from '../classes/registree.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: User;
  registerUser: RegisterUser;


  constructor(public  afAuth: AngularFireAuth, public  router: Router, public db: AngularFirestore) {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.user = user;
        localStorage.setItem('user', JSON.stringify(this.user));
      } else {
        localStorage.setItem('user', null);
      }
    });
  }

  async login(email: string, password: string) {
    try {
      await this.afAuth.auth.signInWithEmailAndPassword(email, password);
      this.router.navigate(['/dashboard']);
    } catch (e) {
      alert('Error!' + e.message);
    }
  }

  async logout() {
    await this.afAuth.auth.signOut();
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return user !== null;
  }

  async register(email: string, password: string, registerUser: RegisterUser) {
    try {
      await this.afAuth.auth.createUserWithEmailAndPassword(email, password).then(user => {
        return this.db.collection('users').doc(user.user.uid).set({
          uid: user.user.uid,
          name: registerUser.name,
          email: registerUser.email,
          bio: registerUser.bio,
          jobDesc: registerUser.jobDesc,
          dob: registerUser.dob,
          gender: registerUser.gender,
          currentStoryboard: false,
          storyboards: []
        });
      }).then(() => {
        this.router.navigate(['/login']);
      });
    } catch (e) {
      alert('Error!' + e.message);
    }
  }

}



