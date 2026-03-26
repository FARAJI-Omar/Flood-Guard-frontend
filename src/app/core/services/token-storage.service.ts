import { Injectable } from '@angular/core';
import { AuthSession } from '../models/auth.models';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {
  private readonly sessionKey = 'auth_session';
  private readonly rememberMeKey = 'auth_remember';
  private readonly refreshDeadlineKey = 'auth_refreshDeadline';
  private readonly tokenIssuedAtKey = 'auth_token_issued_at';

  saveSession(session: AuthSession): void {
    localStorage.setItem(this.sessionKey, JSON.stringify(session));
    localStorage.setItem(this.tokenIssuedAtKey, Date.now().toString());
  }

  getSession(): AuthSession | null {
    const rawSession = localStorage.getItem(this.sessionKey);

    if (!rawSession) {
      return null;
    }

    try {
      const parsedSession = JSON.parse(rawSession) as Partial<AuthSession>;

      if (!this.isValidSession(parsedSession)) {
        this.clearSession();
        return null;
      }

      return parsedSession;
    } catch {
      this.clearSession();
      return null;
    }
  }

  hasSession(): boolean {
    return this.getSession() !== null;
  }

  setRememberSession(refreshDeadlineMs: number): void {
    localStorage.setItem(this.rememberMeKey, 'true');
    localStorage.setItem(this.refreshDeadlineKey, String(refreshDeadlineMs));
  }

  isRememberSessionEnabled(): boolean {
    return localStorage.getItem(this.rememberMeKey) === 'true';
  }

  getRefreshDeadlineMs(): number | null {
    const rawDeadline = localStorage.getItem(this.refreshDeadlineKey);

    if (!rawDeadline) {
      return null;
    }

    const deadline = Number(rawDeadline);

    if (!Number.isFinite(deadline) || deadline <= 0) {
      this.clearRememberSession();
      return null;
    }

    return deadline;
  }

  clearRememberSession(): void {
    localStorage.removeItem(this.rememberMeKey);
    localStorage.removeItem(this.refreshDeadlineKey);
  }

  clearSession(): void {
    localStorage.removeItem(this.sessionKey);
    localStorage.removeItem(this.tokenIssuedAtKey);
  }

  getTokenIssuedAtMs(): number | null {
    const raw = localStorage.getItem(this.tokenIssuedAtKey);
    if (!raw) return null;
    const timestamp = Number(raw);
    return Number.isFinite(timestamp) ? timestamp : null;
  }

  private isValidSession(session: Partial<AuthSession>): session is AuthSession {
    return Boolean(
      session
      && typeof session.email === 'string'
      && typeof session.username === 'string'
      && typeof session.accessToken === 'string'
      && typeof session.refreshToken === 'string'
    );
  }
}
