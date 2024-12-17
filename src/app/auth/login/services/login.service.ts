import { Injectable } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { catchError, from, map, Observable, switchMap, throwError } from 'rxjs';
import { EncryptionService } from '../../../core/services/encryption/encryption.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private dbService: NgxIndexedDBService,
    private encryptionService: EncryptionService
  ) { }

  login(data: any): Observable<any> {
    return from(this.dbService.getByIndex('users', 'username', data.username)).pipe(
      switchMap((user: any) => {
        if (!user || user.role !== data.role) {
          return throwError(() => new Error('Invalid username or password'));
        }

        return from(this.encryptionService.decryptPassword(user.password)).pipe(
          switchMap((decryptedPassword) => {
            if (decryptedPassword === data.password) {
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
            } else {
              return throwError(() => new Error('Invalid username or password'));
            }
          })
        );
      }),
      catchError((error) => throwError(() => new Error('Something went wrong: ' + error.message)))
    );
  }

}
