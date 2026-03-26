import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenStorageService } from '../services/token-storage.service';
import { env } from '../../../environments/env';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenStorageService = inject(TokenStorageService);

  let modifiedReq = req;
  const isApiRequest = req.url.startsWith(env.apiBaseUrl) || req.url.startsWith('/api');


  const session = tokenStorageService.getSession();

  if (session?.accessToken && isApiRequest) {
    modifiedReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${session.accessToken}`),
    });
  }

  return next(modifiedReq);
};
