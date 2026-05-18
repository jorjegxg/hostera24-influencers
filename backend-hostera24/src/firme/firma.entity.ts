import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CodQr } from '../coduri-qr/cod-qr.entity';

@Entity('firme')
export class Firma {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'parola_hash' })
  parolaHash: string;

  @CreateDateColumn({ name: 'creat_la' })
  creatLa: Date;

  @OneToMany(() => CodQr, (cod) => cod.firma)
  coduriQr: CodQr[];
}
