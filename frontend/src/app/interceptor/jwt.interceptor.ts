import { HttpInterceptorFn } from '@angular/common/http';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  // Récupérer le token depuis localStorage
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;

  // Si token présent, cloner la requête avec l'entête Authorization
  const authReq = token ? req.clone({
    setHeaders: {
      'Content-Type': 'application/ld+json',
      Authorization: `Bearer ${token}`
    }
  }) : req;

  return next(authReq);
};
