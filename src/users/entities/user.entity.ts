import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  BeforeUpdate,
  ManyToOne,
  AfterLoad,
} from 'typeorm';
import { HashContract, Hash } from 'src/commons/bcrypt';
import { Role } from './role.entity';
@Entity('user')
export class User {
  private readonly hash: HashContract;
  constructor() {
    this.hash = Hash.getInstance();
  }
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
      this.password = await this.hash.hashPassword(this.password);
    }
  }
}
