import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  BeforeUpdate,
  ManyToOne,
  AfterLoad,
} from 'typeorm';
import { Hash } from 'src/commons/bcrypt';
import { Role } from './role.entity';

@Entity('user')
export class User {
  static hash = new Hash();
  @PrimaryGeneratedColumn()
  id: number;

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
  roleId: number;

  @ManyToOne(() => Role, (role) => role.users)
  role: Role;

  private tempPassword: string;
  @AfterLoad()
  private loadTempPassword(): void {
    this.tempPassword = this.password;
  }

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (this.tempPassword !== this.password) {
      this.password = await User.hash.hashPassword(this.password);
    }
  }

  @BeforeInsert()
  @BeforeUpdate()
  async toLowerCase(): Promise<void> {
    this.email = this.email.toLowerCase();
  }
}
