import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl} from '@angular/forms';
import {AuthService} from '../../Shared/services/auth.service';
import {RegisterUser} from '../../Shared/classes/registree.model';

class Gender {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  isLinear: false;
  registerForm: FormGroup;
  user: RegisterUser = {
    name: '',
    email: '',
    bio: '',
    gender: '',
    jobDesc: '',
    dob: ''};

  genders: Gender[] = [
    {value: 'male-0', viewValue: 'Male'},
    {value: 'female-1', viewValue: 'Female'},
    {value: 'Other-2', viewValue: 'Other'}
  ];

  constructor(private formBuilder: FormBuilder, private authService: AuthService) {}

  ngOnInit() {
    this.registerForm = new FormGroup ({
      accountDetails: new FormGroup( {
        email: new FormControl(null, Validators.required),
        password: new FormControl (null, Validators.required)
      }),
      profileDetails: new FormGroup( {
        name: new FormControl(null, Validators.required),
        bio: new FormControl(null, Validators.required),
        jobDesc: new FormControl(null, Validators.required),
        DoB: new FormControl(null, Validators.required),
        gender: new FormControl(null, Validators.required)
      }),
    });
  }

  onRegister() {
    console.log(this.registerForm);
    this.user.email = this.registerForm.get('accountDetails.email').value.toString();
    this.user.name = this.registerForm.get('profileDetails.name').value.toString();
    this.user.bio = this.registerForm.get('profileDetails.bio').value.toString();
    this.user.gender = this.registerForm.get('profileDetails.gender').value.toString();
    this.user.jobDesc = this.registerForm.get('profileDetails.jobDesc').value.toString();
    this.user.dob = this.registerForm.get('profileDetails.DoB').value;
    console.log(this.user);
    this.authService.register(this.user.email.valueOf(), this.registerForm.get('accountDetails.password').value.toString(), this.user);
  }

}

