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

  @Column({ name: 'programare_tip', type: 'varchar', length: 16, nullable: true })
  programareTip: 'interval' | 'zile' | null;

  @Column({ name: 'programare_de_la', type: 'date', nullable: true })
  programareDeLa: string | null;

  @Column({ name: 'programare_pana_la', type: 'date', nullable: true })
  programarePanaLa: string | null;

  @Column({ name: 'programare_zile', type: 'varchar', length: 32, nullable: true })
  programareZile: string | null;

  @Column({ name: 'limita_scanari', type: 'int', unsigned: true, nullable: true })
  limitaScanari: number | null;

  @Column({ default: false })
  sters: boolean;

  @CreateDateColumn({ name: 'creat_la' })
  creatLa: Date;

  @OneToMany(() => Scanare, (scanare) => scanare.codQr)
  scanari: Scanare[];
}
