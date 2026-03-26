import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthSessionService } from '../../../../core/services/auth-session.service';
import { EmailExistsDirective } from '../../../../core/directives/email-exists.directive';
import { PasswordMatchDirective } from '../../../../core/directives/password-match.directive';

@Component({
  selector: 'app-register-page',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    PasswordMatchDirective,
    EmailExistsDirective
  ],
  templateUrl: './register-page.component.html'
})
export class RegisterPageComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authSession = inject(AuthSessionService);

  readonly form = this.formBuilder.nonNullable.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]],
    acceptTerms: [false, Validators.requiredTrue]
  });

  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

  submit(): void {
    if (this.form.invalid || this.form.pending || this.isSubmitting) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const { username, email, password } = this.form.getRawValue();

    this.authSession
      .register({ username, email, password })
      .pipe(finalize(() => (this.isSubmitting = false)))
      .subscribe({
        next: () => {
          this.successMessage =
            'Registration successful.';
          this.form.controls.password.reset('');
          this.form.controls.confirmPassword.reset('');
        },
        error: () => {
          this.errorMessage = 'Registration failed. Please verify your data and try again.';
        }
      });
  }
}
