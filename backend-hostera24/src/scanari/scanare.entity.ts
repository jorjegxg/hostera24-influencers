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

  /** false = încercare respinsă (ex. limită atinsă la casă), tot apare în istoric */
  @Column({ default: true })
  reusit: boolean;

  /**
   * true = scanare Flutter a creatorului codului (consumă limita).
   * false = vizită pagină publică (statistici, fără impact la limită).
   */
  @Column({ name: 'contorizeaza_limita', default: false })
  contorizeazaLimita: boolean;

  @ManyToOne(() => CodQr, (cod) => cod.scanari, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cod_qr_id' })
  codQr: CodQr;

  @CreateDateColumn({ name: 'scanat_la' })
  scanatLa: Date;
}
