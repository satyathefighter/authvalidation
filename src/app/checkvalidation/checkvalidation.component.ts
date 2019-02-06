import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Checkuser } from '../models/checkuser';
import { pwdMatchUsernameValidator } from '../custom-validators/pwd-match-username-validator';
import { confirmPasswordValidator } from '../custom-validators/confirm-password-validator';

@Component({
   selector: 'app-checkvalidation',
  templateUrl: './checkvalidation.component.html',
  styleUrls: ['./checkvalidation.component.scss']
})
export class CheckvalidationComponent implements OnInit {
  userForm: FormGroup;
  submitted = false;
  countries: Array<Object>;
  otherCountryFlag = false;
  constructor(private formBuilder: FormBuilder) {
    this.countries = [{id: 'USA', name: 'United States'}, {id: 'UK', name: 'United Kingdom'},
     {id: 'FR', name: 'France'}, {id: 'OT', name: 'Other'}];
  }
  ngOnInit() {
    this.userForm = this.formBuilder.group({
      username: ['', [ Validators.required ]],
      password: ['', [ Validators.required ]],
      confirmPassword: ['', [ Validators.required ]],
      notificationMode: ['', [ Validators.required ]],
      email: '',
      mobileNumber: '',
      bothsameornot: '',
      otherCountry: '',
      country: ['', Validators.required],
      favoriteLocations: this.formBuilder.array([
        this.formBuilder.control('', [Validators.required]),
        this.formBuilder.control('', [Validators.required])
      ]),
      permanentaddress: this.formBuilder.group({
      address1: ['', [ Validators.required ]],
      address2: ['', [ Validators.required ]],
      address3: ['', [ Validators.required ]]
      }),
      presentaddress: this.formBuilder.group({
      address1: ['', [ Validators.required ]],
      address2: ['', [ Validators.required ]],
      address3: ['', [ Validators.required ]]
      })
    });
    this.handleFormChanges();
  }
  handleFormChanges() {
    this.username.valueChanges.subscribe(
      uname => {
        this.password.setValidators([Validators.required, pwdMatchUsernameValidator(uname)]);
        this.password.updateValueAndValidity();
      }
    );
    this.password.valueChanges.subscribe(
      pwd => {
        const uname = this.username.value;
        this.password.setValidators([Validators.required, pwdMatchUsernameValidator(uname)]);

        this.confirmPassword.setValidators([Validators.required, confirmPasswordValidator(pwd)]);
        this.confirmPassword.updateValueAndValidity();
      }
    );
    this.confirmPassword.valueChanges.subscribe(
      () => {
        const pwd = this.password.value;
        this.confirmPassword.setValidators([Validators.required, confirmPasswordValidator(pwd)]);
      }
    );
    this.notificationMode.valueChanges.subscribe(
      mode => {
        console.log('NotificationMode Mode:'+ mode);
        if (mode === 'email') {
           this.email.setValidators([Validators.required, Validators.email]);
           this.mobileNumber.clearValidators();
        } else if (mode === 'mobile') {
           this.mobileNumber.setValidators([Validators.required]);
           this.email.clearValidators();
        } else if (mode === 'both') {
          this.email.setValidators([Validators.required, Validators.email]);
          this.mobileNumber.setValidators([Validators.required]);
        }
        this.email.updateValueAndValidity();
        this.mobileNumber.updateValueAndValidity();
      }
    );
    this.favoriteLocations.valueChanges.subscribe(
      data => {
        console.log('favoriteLocations: ' + data);
      }
    );
    this.favoriteLocations.statusChanges.subscribe(
      status => {
        console.log('favoriteLocations validation status: ' + status);
      }
    );
  this.bothsameornot.valueChanges.subscribe(checkuncheck => {
       if (checkuncheck) {
         this.presentaddresssetter();
       } else {
         this.presentaddress.reset();
       }
      });
  this.permanentaddress.valueChanges.subscribe(changedata => {
    if (this.bothsameornot.value) {
      this.presentaddresssetter();
    }
  });
  this.country.valueChanges.subscribe(selectedCountry => {
    if (selectedCountry === 'OT') {
      this.otherCountryFlag = true;
      this.otherCountry.setValidators([Validators.required]);
        } else {
          this.otherCountryFlag = false;
           this.otherCountry.clearValidators();
        }
        this.otherCountry.updateValueAndValidity();
  });
 }
  onFormSubmit() {;
    this.submitted = true;
    console.log(this.userForm.value);
     if (this.userForm.invalid) {
          return;
      }
      console.log('Success');
      console.log(this.userForm.value);
    this.userForm.reset();
  }
  get fm() {
    return this.userForm.controls;
  }
  get username() {
    return this.userForm.get('username');
  }
  get password() {
    return this.userForm.get('password');
  }
  get confirmPassword() {
    return this.userForm.get('confirmPassword');
  }
  get email() {
    return this.userForm.get('email');
  }
  get mobileNumber() {
    return this.userForm.get('mobileNumber');
  }
  get notificationMode() {
    return this.userForm.get('notificationMode');
  }
  get favoriteLocations() {
    return this.userForm.get('favoriteLocations');
  }
  get country() {
    return this.userForm.get('country');
  }
  get permanentaddress() {
    return this.userForm.get('permanentaddress');
  }
  get presentaddress() {
    return this.userForm.get('presentaddress');
  }
  presentaddresssetter() {
    this.presentaddress.setValue(this.permanentaddress.value);
  }
  get bothsameornot() {
     return this.userForm.get('bothsameornot');
  }
  get otherCountry() {
    return this.userForm.get('otherCountry');
  }
}