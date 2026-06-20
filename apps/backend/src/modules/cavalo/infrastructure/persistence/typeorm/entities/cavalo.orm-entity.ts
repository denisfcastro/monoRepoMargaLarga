import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { SessaoFisioOrmEntity } from '../../../../../sessao-fisio/infrastructure/persistence/typeorm/entities/sessao-fisio.orm-entity';

@Entity('cavalos')
export class CavaloOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column()
  nomeHaras: string;

  @Column({ type: 'date' })
  dataAquisicao: string;

  @Column()
  emTratamento: boolean;

  @Column({ type: 'float' })
  valorCompra: number;

  @OneToMany(() => SessaoFisioOrmEntity, (sessao) => sessao.cavalo, {
    cascade: true,
  })
  sessoes: SessaoFisioOrmEntity[];
}
