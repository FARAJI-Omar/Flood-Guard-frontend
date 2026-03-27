import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../../core/services/user.service';
import { TokenStorageService } from '../../../../core/services/token-storage.service';
import { AuthSessionService } from '../../../../core/services/auth-session.service';
import { EmailExistsDirective } from '../../../../core/directives/email-exists.directive';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, EmailExistsDirective],
  templateUrl: './profile-page.component.html'
})
export class ProfilePageComponent implements OnInit {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private tokenStorage = inject(TokenStorageService);
  private authSession = inject(AuthSessionService);
  private toastrService = inject(ToastrService);
  

  profileForm: FormGroup;
  passwordForm: FormGroup;

  isUpdatingProfile = false;
  isUpdatingPassword = false;

  profileMessage = '';
  profileError = '';

  passwordMessage = '';
  passwordError = '';

  constructor() {
    this.profileForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]]
    });

    this.passwordForm = this.fb.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmNewPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit() {
    const session = this.tokenStorage.getSession();
    if (session) {
      this.profileForm.patchValue({
        username: session.username,
        email: session.email
      });
    }

    this.loadProfile();
  }

  loadProfile() {
    this.userService.getProfile().subscribe({
      next: (profile) => {
        this.profileForm.patchValue({
          username: profile.username,
          email: profile.email
        });
      },
      error: () => {}
    });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('newPassword')?.value === g.get('confirmNewPassword')?.value
      ? null : { mismatch: true };
  }

  updateProfile() {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.isUpdatingProfile = true;
    this.profileMessage = '';
    this.profileError = '';

    const data = this.profileForm.value;

    this.userService.updateProfile({ username: data.username, email: data.email }).subscribe({
      next: () => {
        this.isUpdatingProfile = false;
        this.profileMessage = 'Profile updated successfully.';
        this.authSession.updateUserInfo(data.username, data.email);
        this.toastrService.success('Profile updated successfully!', 'Success');
      },
      error: (err) => {
        this.isUpdatingProfile = false;
        this.profileError = err.error?.message || 'Failed to update profile.';
      }
    });
  }

  updatePassword() {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    this.isUpdatingPassword = true;
    this.passwordMessage = '';
    this.passwordError = '';

    const data = this.passwordForm.value;

    this.userService.updateProfile({ oldPassword: data.oldPassword, newPassword: data.newPassword }).subscribe({
      next: () => {
        this.isUpdatingPassword = false;
        this.passwordMessage = 'Password updated successfully.';
        this.passwordForm.reset();
        this.toastrService.success('Password updated successfully!', 'Success');
      },
      error: (err) => {
        this.isUpdatingPassword = false;
        this.passwordError = err.error?.message || 'Failed to update password.';
      }
    });
  }
}
