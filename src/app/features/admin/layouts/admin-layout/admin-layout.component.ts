import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { AuthSessionService } from '../../../../core/services/auth-session.service';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, AsyncPipe],
  templateUrl: './admin-layout.component.html'
})
export class AdminLayoutComponent {
  readonly isSidebarCollapsed = signal(false);
  private autService = inject(AuthSessionService);
  private readonly authSession = inject(AuthSessionService);

  username$ = this.authSession.username$;

  toggleSidebar(): void {
    this.isSidebarCollapsed.update((value) => !value);
  }
  
  lougout(): void {
    this.autService.logout();
  }
}