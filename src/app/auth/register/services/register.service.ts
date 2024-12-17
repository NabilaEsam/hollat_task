import { Injectable } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { catchError, from, map, Observable, switchMap, throwError } from 'rxjs';
import { EncryptionService } from '../../../core/services/encryption/encryption.service';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(
    private dbService: NgxIndexedDBService,
    private encryptionService: EncryptionService
  ) { }

  register(user: any): Observable<any> {
    return from(this.encryptionService.encryptPassword(user.password)).pipe(
      switchMap((encryptedPassword) => {
        user.password = encryptedPassword;
        return from(this.dbService.add('users', user)).pipe(
          switchMap((savedUser) => {
            user.id = savedUser.id;
            return from(this.encryptionService.generateToken(user)).pipe(
              switchMap((token) => {
                user.token = token;
                return from(this.dbService.update('users', user)).pipe(
                  map(() => {
                    const { password, ...safeUser } = user;
                    return {
                      success: true,
                      token,
                      user: safeUser
                    };
                  })
                );
              })
            );
          })
        );
      }),
      catchError((error) => {
        console.error('Error during registration:', error);
        return throwError(() => new Error('Registration failed'));
      })
    );
  }


}
