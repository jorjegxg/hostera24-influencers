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

  @Column({ name: 'nume_postare_clienti', type: 'varchar', length: 255, nullable: true })
  numePostareClienti: string | null;

  @Column({ name: 'nume_postare_firme', type: 'varchar', length: 255, nullable: true })
  numePostareFirme: string | null;

  @Column({ name: 'pret_redus', type: 'varchar', length: 255, nullable: true })
  pretRedus: string | null;

  @Column({ default: false })
  sters: boolean;

  @CreateDateColumn({ name: 'creat_la' })
  creatLa: Date;

  @OneToMany(() => Scanare, (scanare) => scanare.codQr)
  scanari: Scanare[];
}
