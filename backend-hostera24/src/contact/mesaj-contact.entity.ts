import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('mesaje_contact')
export class MesajContact {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 32 })
  tip: string;

  @Column({ type: 'varchar', length: 255 })
  nume: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 32 })
  telefon: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  agentie: string | null;

  @Column({ type: 'text', nullable: true })
  mesaj: string | null;

  @Column({ name: 'creat_la', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  creatLa: Date;
}
