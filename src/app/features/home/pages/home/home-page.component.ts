import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MapComponent } from '../../../../shared/components/map/map.component';
import { AuthSessionService } from '../../../../core/services/auth-session.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-page',
  imports: [RouterLink, MapComponent, CommonModule],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {
  private authSession = inject(AuthSessionService);
  
  username$ = this.authSession.username$;
  
  get isLoggedIn(): boolean {
    return this.authSession.isLoggedIn();
  }
  
  get dashboardRoute(): string {
    const role = this.authSession.getCurrentRole();
    return role === 'ADMIN' ? '/admin/dashboard' : '/user/dashboard';
  }
}
