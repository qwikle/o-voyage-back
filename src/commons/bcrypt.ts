import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
} from 'crypto';
import { InvalidTokenError } from './exceptions/invalid-token';

@Injectable()
export class Hash implements HashContract {
  private salts: number;
  private iv: string;
  private key: string;
  static hash: HashContract;

  constructor() {
    this.init();
  }

  private init(): void {
    this.salts = parseInt(process.env.SALT_ROUNDS) || 10;
    this.iv = randomBytes(16).toString('hex');
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
    const iv = Buffer.from(this.iv, 'hex');
    const cipher = createCipheriv('aes-256-gcm', this.key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const tag = cipher.getAuthTag();
    return encrypted + '$' + tag.toString('hex') + '$' + iv.toString('hex');
  }

  async decrypt(text: string): Promise<string> {
    try {
      const [encryptedText, tagText, ivText] = text.split('$');
      const iv = Buffer.from(ivText, 'hex');
      const decipher = createDecipheriv('aes-256-gcm', this.key, iv);
      const tag = Buffer.from(tagText, 'hex');
      decipher.setAuthTag(tag);
      let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      return decrypted;
    } catch (error) {
      throw new InvalidTokenError();
    }
  }
}

export interface HashContract {
  hashPassword(password: string): Promise<string>;
  comparePassword(password: string, hash: string): Promise<boolean>;
  encrypt(text: string): Promise<string>;
  decrypt(text: string): Promise<string>;
}
