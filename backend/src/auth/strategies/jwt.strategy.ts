import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'sst-secret-key-2024',
    });
    
    this.logger.debug(`🔧 JWT Strategy - Configurado com secret: ${process.env.JWT_SECRET || 'sst-secret-key-2024'}`);
  }

  async validate(payload: any) {
    this.logger.debug(`🔍 JWT Strategy - Validando payload: ${JSON.stringify(payload)}`);
    this.logger.debug(`🔍 JWT Strategy - Secret usado: ${process.env.JWT_SECRET || 'sst-secret-key-2024'}`);
    
    try {
      this.logger.debug(`🔍 JWT Strategy - Buscando usuário com ID: ${payload.sub}`);
      const user = await this.authService.findById(payload.sub);
      this.logger.debug(`🔍 JWT Strategy - Usuário encontrado: ${JSON.stringify(user)}`);
      
      if (!user) {
        this.logger.error(`❌ JWT Strategy - Usuário não encontrado: ${payload.sub}`);
        throw new UnauthorizedException('Usuário não encontrado');
      }
      
      if (!user.ativo) {
        this.logger.error(`❌ JWT Strategy - Usuário inativo: ${payload.sub}`);
        throw new UnauthorizedException('Usuário inativo');
      }
      
      this.logger.debug(`✅ JWT Strategy - JWT validado com sucesso para usuário: ${user.id}`);
      return user;
    } catch (error) {
      this.logger.error(`❌ JWT Strategy - Erro na validação: ${error.message}`);
      this.logger.error(`❌ JWT Strategy - Stack trace: ${error.stack}`);
      throw error;
    }
  }
}
