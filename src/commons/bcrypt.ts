import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  createHash,
  Cipher,
} from 'crypto';

@Injectable()
export class Hash implements HashContract {
  private salts: number;
  private iv: Buffer;
  private key: string;
  static hash: HashContract;

  constructor() {
    this.init();
  }

  private init(): void {
    this.salts = parseInt(process.env.SALT_ROUNDS) || 10;
    this.iv = randomBytes(16);
    this.key = createHash('sha256')
      .update(String(process.env.KEY))
      .digest('base64')
      .substring(0, 32);
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.salts);
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  async encrypt(text: string): Promise<string> {
    const cipher = createCipheriv('aes-256-ctr', this.key, this.iv);
    const encrypted = cipher.update(text, 'utf8', 'hex');
    return encrypted + cipher.final('hex');
  }

  async decrypt(text: string): Promise<string> {
    const decipher = createDecipheriv('aes-256-ctr', this.key, this.iv);
    const decrypted = decipher.update(text, 'hex', 'utf8');
    return decrypted + decipher.final('utf8');
  }
}

export interface HashContract {
  hashPassword(password: string): Promise<string>;
  comparePassword(password: string, hash: string): Promise<boolean>;
  encrypt(text: string): Promise<string>;
  decrypt(text: string): Promise<string>;
}
