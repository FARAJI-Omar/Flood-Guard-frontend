import { Directive, inject, TemplateRef, ViewContainerRef, OnInit } from '@angular/core';
import { AuthSessionService } from '../services/auth-session.service';

@Directive({
  selector: '[appAdminOnly]',
  standalone: true
})
export class AdminOnlyDirective implements OnInit {
  private readonly authSession = inject(AuthSessionService);
  private readonly templateRef = inject(TemplateRef<any>);
  private readonly viewContainer = inject(ViewContainerRef);

  ngOnInit(): void {
    const role = this.authSession.getCurrentRole();
    
    if (role === 'ADMIN') {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
