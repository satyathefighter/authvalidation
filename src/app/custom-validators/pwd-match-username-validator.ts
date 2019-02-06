import { Directive } from '@angular/core';
import { AbstractControl, ValidatorFn } from '@angular/forms';

export function pwdMatchUsernameValidator(username: String): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
    let password: string = control.value;
    let isInValid = (password === username) ? true : false;
    return isInValid ? {'matchForUsername': {value: 'Invalid'}} : null;
  };
} 