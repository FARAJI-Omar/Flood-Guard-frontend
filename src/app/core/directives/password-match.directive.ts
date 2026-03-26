import { Directive } from '@angular/core';
import {
  AbstractControl,
  NG_VALIDATORS,
  ValidationErrors,
  Validator
} from '@angular/forms';

@Directive({
  selector: '[appPasswordMatch][formGroup]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: PasswordMatchDirective,
      multi: true
    }
  ]
})
export class PasswordMatchDirective implements Validator {
  validate(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (!password || !confirmPassword) {
      return null;
    }

    return password === confirmPassword ? null : { passwordMismatch: true };
  }
}
