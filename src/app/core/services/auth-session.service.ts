import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription, tap } from 'rxjs';
import { AuthResponse, AuthSession, LoginRequest, RegisterRequest } from '../models/auth.models';
import { AuthService } from './auth.service';
import { TokenStorageService } from './token-storage.service';
import { extractRoleFromToken } from '../utils/jwt.helper';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthSessionService {
  private static readonly refreshLeadTimeMs = 13 * 60 * 1000; // 13 minutes
  private static readonly accessTokenLifetimeMs = 15 * 60 * 1000; // 15 minutes
  private static readonly cycleCheckIntervalMs = 60 * 1000; // 1 minute
  private static readonly refreshWindowMs = 7 * 24 * 60 * 60 * 1000; // 7 days

  private readonly authService = inject(AuthService);
  private readonly tokenStorage = inject(TokenStorageService);
  private cycleTimerId: ReturnType<typeof setInterval> | null = null;
  private refreshSubscription: Subscription | null = null;
  private cycleStartedAtMs: number | null = null;
  private refreshTriggeredInCycle = false;
  private refreshEnabledInCycle = false;
  private router = inject(Router);

  private usernameSubject = new BehaviorSubject<string | null>(null);
  private emailSubject = new BehaviorSubject<string | null>(null);

  readonly username$ = this.usernameSubject.asObservable();
  readonly email$ = this.emailSubject.asObservable();

  login(payload: LoginRequest, rememberMe = false): Observable<AuthResponse> {
    return this.authService.login(payload).pipe(
      tap((response) => {
        this.tokenStorage.saveSession(response);
        this.usernameSubject.next(response.username);
        this.emailSubject.next(response.email);

        if (rememberMe) {
          this.tokenStorage.setRememberSession(Date.now() + AuthSessionService.refreshWindowMs);
        } else {
          this.tokenStorage.clearRememberSession();
        }

        this.startTokenTimers(rememberMe);
      })
    );
  }

  register(payload: RegisterRequest): Observable<AuthResponse> {
    return this.authService.register(payload);
  }

  isLoggedIn(): boolean {
    return this.tokenStorage.hasSession();
  }

  getCurrentRole(): string | null {
    const session = this.tokenStorage.getSession();

    if (!session) {
      return null;
    }

    return extractRoleFromToken(session.accessToken);
  }

  getCurrentUsername(): string | null {
    return this.usernameSubject.value;
  }

  getCurrentEmail(): string | null {
    return this.emailSubject.value;
  }

  updateUserInfo(username: string, email: string): void {
    this.usernameSubject.next(username);
    this.emailSubject.next(email);
    
    const session = this.tokenStorage.getSession();
    if (session) {
      session.username = username;
      session.email = email;
      this.tokenStorage.saveSession(session);
    }
  }

  logout(): void {
    this.clearTimers();
    this.cancelRefreshRequest();
    this.tokenStorage.clearRememberSession();
    this.tokenStorage.clearSession();
    this.usernameSubject.next(null);
    this.emailSubject.next(null);
    this.router.navigate(['/login']);
  }

  initializeSession(): void {
    const session = this.tokenStorage.getSession();
    if (session) {
      this.usernameSubject.next(session.username);
      this.emailSubject.next(session.email);
    }

    if (!this.tokenStorage.hasSession() || !this.tokenStorage.isRememberSessionEnabled()) {
      return;
    }

    const tokenIssuedAtMs = this.tokenStorage.getTokenIssuedAtMs();
    if (!tokenIssuedAtMs) {
      this.logout();
      return;
    }

    const elapsedMs = Date.now() - tokenIssuedAtMs;

    if (elapsedMs >= AuthSessionService.accessTokenLifetimeMs) {
      this.logout();
      return;
    }

    this.cycleStartedAtMs = tokenIssuedAtMs;
    this.refreshEnabledInCycle = true;
    this.refreshTriggeredInCycle = elapsedMs >= AuthSessionService.refreshLeadTimeMs;

    this.cycleTimerId = setInterval(() => {
      this.runTokenCycleCheck();
    }, AuthSessionService.cycleCheckIntervalMs);
  }

  private startTokenTimers(enableRefresh: boolean): void {
    this.clearTimers();
    this.cycleStartedAtMs = Date.now();
    this.refreshTriggeredInCycle = false;
    this.refreshEnabledInCycle = enableRefresh;

    this.cycleTimerId = setInterval(() => {
      this.runTokenCycleCheck();
    }, AuthSessionService.cycleCheckIntervalMs);
  }

  private runTokenCycleCheck(): void {
    if (this.cycleStartedAtMs === null) {
      return;
    }

    if (!this.tokenStorage.hasSession()) {
      this.logout();
      return;
    }

    const elapsedMs = Date.now() - this.cycleStartedAtMs;

    if (
      this.refreshEnabledInCycle
      && !this.refreshTriggeredInCycle
      && elapsedMs >= AuthSessionService.refreshLeadTimeMs
    ) {
      if (!this.canRefresh()) {
        this.logout();
        return;
      }

      this.refreshTriggeredInCycle = true;
      this.refreshAccessToken();
      return;
    }

    if (elapsedMs >= AuthSessionService.accessTokenLifetimeMs) {
      this.logout();
    }
  }

  private refreshAccessToken(): void {
    const session = this.tokenStorage.getSession();

    if (!session || !this.canRefresh()) {
      this.logout();
      return;
    }

    this.cancelRefreshRequest();
    this.refreshSubscription = this.authService
      .refreshToken({ refreshToken: session.refreshToken })
      .subscribe({
        next: (response) => {
          this.saveRefreshedSession(session, response.accessToken);
          this.startTokenTimers(true);
        },
        error: () => {
          this.logout();
        }
      });
  }

  private canRefresh(): boolean {
    if (!this.tokenStorage.isRememberSessionEnabled()) {
      return false;
    }

    const refreshDeadlineMs = this.tokenStorage.getRefreshDeadlineMs();

    if (refreshDeadlineMs === null) {
      return false;
    }

    return Date.now() < refreshDeadlineMs;
  }

  private saveRefreshedSession(session: AuthSession, accessToken: string, refreshToken?: string): void {
    this.tokenStorage.saveSession({
      ...session,
      accessToken,
      refreshToken: refreshToken ?? session.refreshToken
    });
  }

  private clearTimers(): void {
    if (this.cycleTimerId) {
      clearInterval(this.cycleTimerId);
      this.cycleTimerId = null;
    }

    this.cycleStartedAtMs = null;
    this.refreshTriggeredInCycle = false;
    this.refreshEnabledInCycle = false;
  }

  private cancelRefreshRequest(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
      this.refreshSubscription = null;
    }
  }
}
