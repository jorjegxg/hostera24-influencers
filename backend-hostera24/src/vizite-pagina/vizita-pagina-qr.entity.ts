import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CodQr } from '../coduri-qr/cod-qr.entity';

/** O singură înregistrare per cod QR — total vizite pagină publică (fără oră per vizită). */
@Entity('vizite_pagina_qr')
export class VizitaPaginaQr {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'cod_qr_id', unique: true })
  codQrId: number;

  @OneToOne(() => CodQr, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cod_qr_id' })
  codQr: CodQr;

  @Column({ name: 'numar_vizite', type: 'int', unsigned: true, default: 0 })
  numarVizite: number;

  @UpdateDateColumn({ name: 'actualizat_la' })
  actualizatLa: Date;
}
