import {
  AfterInsert,
  AfterUpdate,
  AfterRemove,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { Report } from '../reports/report.entity';
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Report, (report) => report.user)
  report: Report[];

  @AfterInsert()
  logInsert() {
    console.log('Inserted User with Id', this.id);
  }
  @AfterUpdate()
  logUpdate() {
    console.log('Updated User with Id', this.id);
  }
  @AfterRemove()
  logRemovet() {
    console.log('Removed User with Id', this.id);
  }
}
