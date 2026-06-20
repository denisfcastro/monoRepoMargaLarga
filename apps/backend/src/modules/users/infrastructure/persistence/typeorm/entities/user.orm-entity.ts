import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export type UserRole = 'admin' | 'user';

@Entity('users')
export class UserOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column({ unique: true })
  email: string;

  @Column()
  senha: string; // armazenada como hash bcrypt

  @Column({ default: false })
  ativo: boolean;

  @Column({ default: 'user' })
  role: UserRole;
}
