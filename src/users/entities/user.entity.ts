import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  BeforeUpdate,
  AfterLoad,
} from 'typeorm';
import { HashContract, Hash } from 'src/commons/bcrypt';
@Entity()
export class User {
  private readonly hash: HashContract;
  constructor() {
    this.hash = Hash.getInstance();
  }
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  email: string;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column()
  password: string;

  @Column({ default: false })
  isBanned: boolean;

  @Column()
  role_id: string;

  private tempPassword: string;
  @AfterLoad()
  private loadTempPassword(): void {
    this.tempPassword = this.password;
  }

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (this.tempPassword !== this.password) {
      this.password = await this.hash.hashPassword(this.password);
    }
  }
}
