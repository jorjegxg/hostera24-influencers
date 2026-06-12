import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Firma } from '../firme/firma.entity';

@Entity('angajati')
export class Angajat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'firma_id' })
  firmaId: number;

  @ManyToOne(() => Firma, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'firma_id' })
  firma: Firma;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  nume: string | null;

  @Column({
    name: 'firebase_uid',
    type: 'varchar',
    length: 128,
    nullable: true,
    unique: true,
  })
  firebaseUid: string | null;

  @CreateDateColumn({ name: 'creat_la' })
  creatLa: Date;
}
