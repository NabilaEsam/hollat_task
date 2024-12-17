import { Injectable } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { firstValueFrom } from 'rxjs';
import { EncryptionService } from '../encryption/encryption.service';

@Injectable({
  providedIn: 'root'
})
export class PreloaderService {

  constructor(
    private dbService: NgxIndexedDBService,
    private encryptionService: EncryptionService
  ) { }

  async initializeAdminAccount(): Promise<void> {
    const defaultAdmin = { username: 'admin', password: '', role: 'Admin' };

    try {
      const admin = await firstValueFrom(this.dbService.getByIndex('users', 'role', 'Admin'));

      if (!admin) {
        defaultAdmin.password = await this.encryptionService.encryptPassword('admin123');

        await firstValueFrom(this.dbService.add('users', defaultAdmin));
      } else {
      }
    } catch (error) {
      throw error;
    }
  }

}
