import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Firma } from '../firme/firma.entity';
import { Scanare } from '../scanari/scanare.entity';

@Entity('coduri_qr')
export class CodQr {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'firma_id' })
  firmaId: number;

  @ManyToOne(() => Firma, (firma) => firma.coduriQr, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'firma_id' })
  firma: Firma;

  @Column({ unique: true })
  cod: string;

  @Column({ name: 'nume_postare_clienti' })
  numePostareClienti: string;

  @Column({ name: 'nume_postare_firme' })
  numePostareFirme: string;

  @CreateDateColumn({ name: 'creat_la' })
  creatLa: Date;

  @OneToMany(() => Scanare, (scanare) => scanare.codQr)
  scanari: Scanare[];
}
