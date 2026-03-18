import { Directive, inject } from '@angular/core';
import {
  AbstractControl,
  AsyncValidator,
  NG_ASYNC_VALIDATORS,
  ValidationErrors
} from '@angular/forms';
import { Observable, of, timer } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { AuthSessionService } from '../services/auth-session.service';

@Directive({
  selector: '[appEmailExists]',
  providers: [
    {
      provide: NG_ASYNC_VALIDATORS,
      useExisting: EmailExistsDirective,
      multi: true
    }
  ],
  standalone: true
})
export class EmailExistsDirective implements AsyncValidator {
  private authService = inject(AuthService);
  private authSession = inject(AuthSessionService);

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    const email = String(control.value ?? '').trim();

    if (!email || control.hasError('email')) {
      return of(null);
    }

    const currentEmail = this.authSession.getCurrentEmail();
    if (email === currentEmail) {
      return of(null);
    }

    return timer(500).pipe(
      switchMap(() => this.authService.checkEmailExists(email)),
      map((exists) => (exists ? { emailExists: true } : null)),
      catchError(() => of({ emailCheckFailed: true }))
    );
  }
}
