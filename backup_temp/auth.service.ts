import { Injectable, UnauthorizedException, BadRequestException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserStatus } from '../entities/User';
import { LoginDto, RegisterDto, RefreshTokenDto, ChangePasswordDto, ForgotPasswordDto, ResetPasswordDto } from './dto/auth.dto';
import { ConfigService } from '@nestjs/config';

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  empresaId?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    empresaId?: string;
    unidadeId?: string;
  };
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    // Verificar se o usuário já existe
    const existingUser = await this.userRepository.findOne({
      where: { email: registerDto.email }
    });

    if (existingUser) {
      throw new ConflictException('Usuário já existe com este email');
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(registerDto.password, 12);

    // Criar usuário
    const user = this.userRepository.create({
      ...registerDto,
      password: hashedPassword,
      status: UserStatus.PENDING_APPROVAL,
    });

    const savedUser = await this.userRepository.save(user);

    // Gerar tokens
    const tokens = await this.generateTokens(savedUser);

    return {
      ...tokens,
      user: {
        id: savedUser.id,
        email: savedUser.email,
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        role: savedUser.role,
        empresaId: savedUser.empresaId,
        unidadeId: savedUser.unidadeId,
      }
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    // Buscar usuário
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
      select: ['id', 'email', 'password', 'firstName', 'lastName', 'role', 'status', 'empresaId', 'unidadeId']
    });

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // Verificar status do usuário
    if (user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException('Usuário não está ativo');
    }

    // Verificar senha
    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // Atualizar último login
    await this.userRepository.update(user.id, {
      lastLoginAt: new Date(),
      lastLoginIp: '127.0.0.1', // TODO: Extrair IP real da requisição
    });

    // Gerar tokens
    const tokens = await this.generateTokens(user);

    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        empresaId: user.empresaId,
        unidadeId: user.unidadeId,
      }
    };
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto): Promise<AuthResponse> {
    try {
      // Verificar refresh token
      const payload = await this.jwtService.verifyAsync(refreshTokenDto.refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      // Buscar usuário
      const user = await this.userRepository.findOne({
        where: { id: payload.sub },
        select: ['id', 'email', 'firstName', 'lastName', 'role', 'status', 'empresaId', 'unidadeId']
      });

      if (!user || user.status !== UserStatus.ACTIVE) {
        throw new UnauthorizedException('Usuário não encontrado ou inativo');
      }

      // Gerar novos tokens
      const tokens = await this.generateTokens(user);

      return {
        ...tokens,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          empresaId: user.empresaId,
          unidadeId: user.unidadeId,
        }
      };
    } catch (error) {
      throw new UnauthorizedException('Refresh token inválido');
    }
  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['id', 'password']
    });

    if (!user) {
      throw new BadRequestException('Usuário não encontrado');
    }

    // Verificar senha atual
    const isCurrentPasswordValid = await bcrypt.compare(changePasswordDto.currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      throw new BadRequestException('Senha atual incorreta');
    }

    // Hash da nova senha
    const hashedNewPassword = await bcrypt.hash(changePasswordDto.newPassword, 12);

    // Atualizar senha
    await this.userRepository.update(userId, {
      password: hashedNewPassword,
    });
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { email: forgotPasswordDto.email }
    });

    if (user) {
      // TODO: Implementar envio de email com token de reset
      // Por enquanto, apenas log
      console.log(`Token de reset enviado para ${forgotPasswordDto.email}`);
    }
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {
    // TODO: Implementar verificação do token e reset da senha
    // Por enquanto, apenas validação básica
    if (resetPasswordDto.token.length < 10) {
      throw new BadRequestException('Token inválido');
    }

    // TODO: Buscar usuário pelo token e atualizar senha
  }

  async logout(userId: string): Promise<void> {
    // TODO: Implementar blacklist de tokens ou invalidação
    // Por enquanto, apenas log
    console.log(`Usuário ${userId} fez logout`);
  }

  async validateUser(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId, status: UserStatus.ACTIVE }
    });

    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado ou inativo');
    }

    return user;
  }

  private async generateTokens(user: User): Promise<{ accessToken: string; refreshToken: string }> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      empresaId: user.empresaId,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: '15m', // Access token expira em 15 minutos
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: '7d', // Refresh token expira em 7 dias
      }),
    ]);

    return { accessToken, refreshToken };
  }
}
