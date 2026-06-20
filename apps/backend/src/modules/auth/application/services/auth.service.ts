import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Inject } from '@nestjs/common';
import { UsersService } from '../../../users/application/services/users.service';
import { RegisterDto } from '../../presentation/dtos/register.dto';
import { LoginDto } from '../../presentation/dtos/login.dto';
import { USER_REPOSITORY_PORT } from '../../../users/application/ports/user.repository.port';
import type { UserRepositoryPort } from '../../../users/application/ports/user.repository.port';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @Inject(USER_REPOSITORY_PORT)
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async register(dto: RegisterDto): Promise<{ message: string }> {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException(
        `O e-mail '${dto.email}' já está cadastrado. Aguarde a liberação pelo administrador ou entre em contato com o suporte.`,
      );
    }

    const hashed = await bcrypt.hash(dto.senha, 10);
    await this.userRepository.save({
      nome: dto.nome,
      email: dto.email,
      senha: hashed,
      ativo: false,
      role: 'user',
    });

    return {
      message:
        'Cadastro realizado com sucesso! Sua conta está aguardando liberação pelo administrador.',
    };
  }

  async login(dto: LoginDto): Promise<{ access_token: string }> {
    const GENERIC_ERROR = 'E-mail ou senha incorretos.';

    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException(GENERIC_ERROR);
    }

    const senhaValida = await bcrypt.compare(dto.senha, user.senha);
    if (!senhaValida) {
      throw new UnauthorizedException(GENERIC_ERROR);
    }

    if (!user.ativo) {
      throw new UnauthorizedException(GENERIC_ERROR);
    }

    const payload = { sub: user.id, email: user.email, nome: user.nome, role: user.role };
    const access_token = this.jwtService.sign(payload);

    return { access_token };
  }
}
