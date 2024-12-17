import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import * as jose from 'jose';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {

  encryptionKey!: Uint8Array;

  constructor() {
    this.encryptionKey = new TextEncoder().encode(environment.encryptionKey);
  }

  async encryptPassword(password: string): Promise<string> {
    const jwe = await new jose.CompactEncrypt(new TextEncoder().encode(password))
      .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
      .encrypt(this.encryptionKey);

    return jwe;
  }

  async decryptPassword(encryptedPassword: string): Promise<string> {
    const { plaintext } = await jose.compactDecrypt(encryptedPassword, this.encryptionKey);
    return new TextDecoder().decode(plaintext);
  }

  async generateToken(user: any): Promise<string> {
    const payload = {
      username: user.username,
      role: user.role,
      userId: user.userId
    };

    const jwt = await new jose.SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('1h')
      .sign(this.encryptionKey);

    return jwt;
  }

}
