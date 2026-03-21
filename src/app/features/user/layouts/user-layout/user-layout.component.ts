import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AsyncPipe } from '@angular/common';

import { AuthSessionService } from '../../../../core/services/auth-session.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-user-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, AsyncPipe],
  templateUrl: './user-layout.component.html'
})
export class UserLayoutComponent {
    authSession = inject(AuthSessionService);
    authService = inject(AuthService);
    dropdownOpen = false;
    username$ = this.authSession.username$;


  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

   lougout(): void {
    this.authSession.logout();
  }
}
