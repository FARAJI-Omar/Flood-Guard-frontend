import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { env } from '../../../environments/env';
import { UserProfile, UpdateProfileDto } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${env.apiBaseUrl}/users/me`;

  getProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(this.apiUrl);
  }

  updateProfile(data: UpdateProfileDto): Observable<UserProfile> {
    return this.http.put<UserProfile>(this.apiUrl, data);
  }

  // total users role='USER'
  totalUsers(): Observable<{ count: number }> {
    return this.http.get<any[]>(`${env.apiBaseUrl}/users`).pipe(
      map(users => users.filter(user => user.role === 'USER').length),
      map(count => ({ count }))
    );
  }
}
