import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LocalizeRouterService } from '@gilsdav/ngx-translate-router';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { BehaviorSubject, catchError, from, map, Observable, of, switchMap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userSubject$ = new BehaviorSubject<any>(null);

  constructor(
    private router: Router,
    private localizeRouterService: LocalizeRouterService,
    private dbService: NgxIndexedDBService
  ) { }

  getUserData(token: string): Observable<any> {
    return from(this.dbService.getAll('users')).pipe(
      map((users: any[]) => {
        const user = users.find((u) => u.token === token);

        if (!user) {
          throw new Error('Invalid token or user not found');
        }

        delete user.password;
        delete user.token;

        return user;
      }),
      catchError((error) => {
        console.error('Error in getUserData:', error);
        return throwError(() => new Error('Something went wrong: ' + error.message));
      })
    );
  }

  logout(token: string): Observable<any> {
    return from(this.dbService.getAll('users')).pipe(
      map((users: any[]) => {
        const user = users.find((u) => u.token === token);

        if (!user) {
          throw new Error('Invalid token or user not found');
        }
        user.token = null;
        return this.dbService.update('users', user);
      }),
      switchMap(() => {
        return of({
          success: true,
          message: 'Logout successful',
        });
      }),
      catchError((error) => {
        console.error('Error during logout:', error);
        return throwError(() => new Error('Logout failed: ' + error.message));
      })
    );
  }

  isLoggedIn(): boolean {
    if (this.userSubject$.value || localStorage.getItem('HR_DEPARTMENT_TOKEN'))
      return true;

    this.router.navigate([`/${this.localizeRouterService.parser.currentLang}/auth`]);
    return false;
  }

  isNotLoggedIn(): boolean {
    if (!localStorage.getItem('HR_DEPARTMENT_TOKEN'))
      return true;

    this.router.navigate([`/${this.localizeRouterService.parser.currentLang}`]);
    return false;
  }

}
