import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthSessionService } from '../../../../core/services/auth-session.service';

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login-page.component.html'
})
export class LoginPageComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authSession = inject(AuthSessionService);
  private readonly router = inject(Router);

  readonly form = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    keepMeLoggedIn: [false]
  });

  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

  submit(): void {
    if (this.form.invalid || this.isSubmitting) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authSession
      .login({
        email: this.form.controls.email.getRawValue(),
        password: this.form.controls.password.getRawValue()
      }, this.form.controls.keepMeLoggedIn.getRawValue())
      .pipe(finalize(() => (this.isSubmitting = false)))
      .subscribe({
        next: () => {
          if (this.authSession.getCurrentRole() === 'ADMIN') {
            void this.router.navigateByUrl('/admin/dashboard');
            return;
          }

          if (this.authSession.getCurrentRole() === 'USER') {
            void this.router.navigateByUrl('/user/dashboard');
            return;
          }

          this.successMessage = 'Login successful.';
        },
        error: () => {
          this.errorMessage = 'Invalid email or password. Please try again.';
        }
      });
  }
}
