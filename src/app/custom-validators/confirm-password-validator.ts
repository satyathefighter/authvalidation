import { Directive } from '@angular/core';
import { AbstractControl, ValidatorFn } from '@angular/forms';

export function confirmPasswordValidator(confirmPassword: String): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
    let password: string = control.value;
    let isInValid = (password !== confirmPassword) ? true : false;
    return isInValid ? {'cnfPassword': {value: 'Invalid'}} : null;
  };
}