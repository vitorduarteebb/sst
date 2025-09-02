import { 
  Controller, 
  Post, 
  Body, 
  UseGuards, 
  Get, 
  Request,
  HttpCode,
  HttpStatus 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { 
  LoginDto, 
  RegisterDto, 
  LoginResponseDto, 
  UserResponseDto 
} from './dto/auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { UserRole } from './dto/auth.dto';

@ApiTags('Autenticação')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Login do usuário',
    description: 'Realiza login com email e senha, retornando token JWT',
  })
  @ApiResponse({
    status: 200,
    description: 'Login realizado com sucesso',
    type: LoginResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Credenciais inválidas',
  })
  async login(@Body() loginDto: LoginDto, @Request() req): Promise<LoginResponseDto> {
    return this.authService.login(loginDto);
  }

  @Post('register')
  @ApiOperation({
    summary: 'Registro de usuário',
    description: 'Cria uma nova conta de usuário',
  })
  @ApiResponse({
    status: 201,
    description: 'Usuário criado com sucesso',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos ou usuário já existe',
  })
  async register(@Body() registerDto: RegisterDto): Promise<UserResponseDto> {
    return this.authService.register(registerDto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Perfil do usuário',
    description: 'Retorna os dados do usuário autenticado',
  })
  @ApiResponse({
    status: 200,
    description: 'Perfil retornado com sucesso',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado',
  })
  async getProfile(@Request() req): Promise<UserResponseDto> {
    return req.user;
  }

  @Get('users')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Listar usuários',
    description: 'Lista todos os usuários (apenas ADMIN)',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuários retornada com sucesso',
    type: [UserResponseDto],
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado',
  })
  @ApiResponse({
    status: 403,
    description: 'Acesso negado',
  })
  async findAll(): Promise<UserResponseDto[]> {
    return this.authService.findAll();
  }

  @Get('validate')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Validar token',
    description: 'Valida se o token JWT é válido',
  })
  @ApiResponse({
    status: 200,
    description: 'Token válido',
  })
  @ApiResponse({
    status: 401,
    description: 'Token inválido',
  })
  async validateToken(@Request() req) {
    return { 
      valid: true, 
      user: req.user,
      message: 'Token válido' 
    };
  }
}
