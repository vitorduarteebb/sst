import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto, UserResponseDto, UserRole } from './dto/user.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';

@ApiTags('Users')
@Controller('users')
// @UseGuards(JwtAuthGuard, RolesGuard) // Temporariamente comentado
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  // @Roles(UserRole.ADMIN, UserRole.TECNICO) // Temporariamente comentado
  @ApiOperation({ summary: 'Listar usuários' })
  @ApiResponse({ status: 200, description: 'Lista de usuários', type: [UserResponseDto] })
  async findAll(@Query() filters: any) {
    console.log('🔍 UsersController - findAll chamado');
    console.log('🔍 UsersController - Filtros:', filters);
    console.log('🔍 UsersController - Request headers:', this.getRequestHeaders());
    
    try {
      const result = await this.usersService.findAll(filters);
      console.log('✅ UsersController - findAll retornou:', result.length, 'usuários');
      return result;
    } catch (error) {
      console.error('❌ UsersController - Erro em findAll:', error);
      throw error;
    }
  }

  @Get(':id')
  // @Roles(UserRole.ADMIN, UserRole.TECNICO) // Temporariamente comentado
  @ApiOperation({ summary: 'Buscar usuário por ID' })
  @ApiResponse({ status: 200, description: 'Usuário encontrado', type: UserResponseDto })
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Post()
  // @Roles(UserRole.ADMIN) // Temporariamente comentado
  @ApiOperation({ summary: 'Criar novo usuário' })
  @ApiResponse({ status: 201, description: 'Usuário criado', type: UserResponseDto })
  async create(@Body() createUserDto: CreateUserDto) {
    console.log('🔍 UsersController - create chamado');
    console.log('🔍 UsersController - Dados recebidos:', createUserDto);
    console.log('🔍 UsersController - Request headers:', this.getRequestHeaders());
    
    try {
      const result = await this.usersService.create(createUserDto);
      console.log('✅ UsersController - create retornou:', result);
      return result;
    } catch (error) {
      console.error('❌ UsersController - Erro em create:', error);
      throw error;
    }
  }

  @Put(':id')
  // @Roles(UserRole.ADMIN) // Temporariamente comentado
  @ApiOperation({ summary: 'Atualizar usuário' })
  @ApiResponse({ status: 200, description: 'Usuário atualizado', type: UserResponseDto })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  // @Roles(UserRole.ADMIN) // Temporariamente comentado
  @ApiOperation({ summary: 'Remover usuário' })
  @ApiResponse({ status: 200, description: 'Usuário removido' })
  async remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Get('check-email')
  @ApiOperation({ summary: 'Verificar disponibilidade de email' })
  @ApiResponse({ status: 200, description: 'Disponibilidade do email' })
  async checkEmailAvailability(@Query('email') email: string) {
    return this.usersService.checkEmailAvailability(email);
  }

  @Get('check-cpf')
  @ApiOperation({ summary: 'Verificar disponibilidade de CPF' })
  @ApiResponse({ status: 200, description: 'Disponibilidade do CPF' })
  async checkCpfAvailability(@Query('cpf') cpf: string) {
    return this.usersService.checkCpfAvailability(cpf);
  }

  private getRequestHeaders() {
    // Esta é uma função helper para obter headers da requisição
    // Como estamos em um controller, não temos acesso direto aos headers
    // Mas podemos logar que a requisição chegou
    return 'Request received';
  }
}
