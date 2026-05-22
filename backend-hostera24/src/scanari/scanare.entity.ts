import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CodQr } from '../coduri-qr/cod-qr.entity';

@Entity('scanari')
export class Scanare {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'cod_qr_id' })
  codQrId: number;

  /** false = încercare respinsă (ex. limită atinsă), tot apare în istoric */
  @Column({ default: true })
  reusit: boolean;

  @ManyToOne(() => CodQr, (cod) => cod.scanari, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cod_qr_id' })
  codQr: CodQr;

  @CreateDateColumn({ name: 'scanat_la' })
  scanatLa: Date;
}
