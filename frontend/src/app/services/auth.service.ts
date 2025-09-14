import {Injectable, signal} from '@angular/core';
import {LoginCredentials, User} from '../models/user';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // Signals pour l'état d'authentification
  private isAuthenticatedSignal = signal<boolean>(typeof window !== 'undefined' && !!localStorage.getItem('auth_token'));
  private currentUserSignal = signal<User | null>(null);
  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);

  // Signals publics (readonly)
  isAuthenticated = this.isAuthenticatedSignal.asReadonly();
  currentUser = this.currentUserSignal.asReadonly();
  loading = this.loadingSignal.asReadonly();
  error = this.errorSignal.asReadonly();

  constructor(
    private router: Router
  ) {
    // Vérifier si l'utilisateur est déjà connecté au démarrage
    this.checkAuthStatus();
  }

  private checkAuthStatus() {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('auth_token');
    const user = localStorage.getItem('current_user');

    if (token && user) {
      try {
        this.currentUserSignal.set(JSON.parse(user));
        this.isAuthenticatedSignal.set(true);
      } catch (error) {
        this.logout();
      }
    }
  }

  login(credentials: LoginCredentials) {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    // Simulation d'une API de login (à remplacer par ta vraie API)
    return this.simulateLogin(credentials)
      .then(response => {
          // Stocker le token et les infos utilisateur
          localStorage.setItem('auth_token', response.token);
          localStorage.setItem('current_user', JSON.stringify(response.user));

          this.currentUserSignal.set(response.user);
          this.isAuthenticatedSignal.set(true);
          this.loadingSignal.set(false);

          // Redirection vers la liste des examens
          this.router.navigate(['/exams']);
        })
      .catch(error => {
          console.log('Error during login:', error);
          this.errorSignal.set('Email ou mot de passe incorrect');
          this.loadingSignal.set(false);
        }
      );
  }

  // TODO: change to real user in API
  // Simulation d'API login
  private simulateLogin(credentials: LoginCredentials) {
    // Simulation avec délai
    return new Promise<{token: string, user: User}>((resolve, reject) => {
      setTimeout(() => {
        // Credentials de test
        if (credentials.email === 'admin@exam.com' && credentials.password === 'password') {
          resolve({
            token: 'fake-jwt-token-' + Date.now(),
            user: { id: 1, email: credentials.email, name: 'Administrateur' }
          });
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 1000);
    });
  }

  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('current_user');

    this.currentUserSignal.set(null);
    this.isAuthenticatedSignal.set(false);
    this.errorSignal.set(null);

    this.router.navigate(['/login']);
  }
}
