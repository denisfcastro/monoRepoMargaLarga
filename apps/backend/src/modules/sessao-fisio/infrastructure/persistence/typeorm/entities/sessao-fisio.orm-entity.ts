import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CavaloOrmEntity } from '../../../../../cavalo/infrastructure/persistence/typeorm/entities/cavalo.orm-entity';

@Entity('sessoes_fisio')
export class SessaoFisioOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  focoLesao: string;

  @Column({ type: 'date' })
  dataSessao: string;

  @Column()
  progressoBoa: boolean;

  @Column()
  duracaoMin: number;

  @Column()
  cavaloId: number;

  @ManyToOne(() => CavaloOrmEntity, (cavalo) => cavalo.sessoes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'cavaloId' })
  cavalo: CavaloOrmEntity;
}
