import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { UsersService } from './users.service';
import {
  CreateUserDto,
  UpdateUserDto,
  UserResponseDto,
  UserFilterDto,
  ChangePasswordDto,
} from './dto/user.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('Usuários')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Criar novo usuário' })
  @ApiResponse({ status: 201, description: 'Usuário criado com sucesso', type: UserResponseDto })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 409, description: 'Email ou CPF já existe' })
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar usuários com filtros' })
  @ApiResponse({ status: 200, description: 'Lista de usuários', type: [UserResponseDto] })
  @ApiQuery({ name: 'search', required: false, description: 'Buscar por nome, email ou CPF' })
  @ApiQuery({ name: 'role', required: false, description: 'Filtrar por role' })
  @ApiQuery({ name: 'status', required: false, description: 'Filtrar por status' })
  @ApiQuery({ name: 'empresaId', required: false, description: 'Filtrar por empresa' })
  @ApiQuery({ name: 'unidadeId', required: false, description: 'Filtrar por unidade' })
  @ApiQuery({ name: 'ativo', required: false, description: 'Filtrar por status ativo' })
  async findAll(@Query() filters: UserFilterDto): Promise<UserResponseDto[]> {
    return this.usersService.findAll(filters);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Obter estatísticas dos usuários' })
  @ApiResponse({ status: 200, description: 'Estatísticas dos usuários' })
  @ApiQuery({ name: 'empresaId', required: false, description: 'ID da empresa para filtrar estatísticas' })
  async getStats(@Query('empresaId') empresaId?: string) {
    return this.usersService.getStats(empresaId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter usuário por ID' })
  @ApiResponse({ status: 200, description: 'Usuário encontrado', type: UserResponseDto })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  async findOne(@Param('id') id: string): Promise<UserResponseDto> {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar usuário' })
  @ApiResponse({ status: 200, description: 'Usuário atualizado com sucesso', type: UserResponseDto })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  @ApiResponse({ status: 409, description: 'Email já existe' })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.usersService.update(id, updateUserDto);
  }

  @Patch(':id/password')
  @ApiOperation({ summary: 'Alterar senha do usuário' })
  @ApiResponse({ status: 200, description: 'Senha alterada com sucesso' })
  @ApiResponse({ status: 400, description: 'Senha atual incorreta' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  async changePassword(
    @Param('id') id: string,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    return this.usersService.changePassword(id, changePasswordDto);
  }

  @Patch(':id/toggle-status')
  @ApiOperation({ summary: 'Alternar status do usuário (ativo/inativo)' })
  @ApiResponse({ status: 200, description: 'Status alterado com sucesso', type: UserResponseDto })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  async toggleStatus(@Param('id') id: string): Promise<UserResponseDto> {
    return this.usersService.toggleStatus(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover usuário (soft delete)' })
  @ApiResponse({ status: 204, description: 'Usuário removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.usersService.remove(id);
  }

  @Get('check/email/:email')
  @ApiOperation({ summary: 'Verificar disponibilidade de email' })
  @ApiResponse({ status: 200, description: 'Email disponível ou não' })
  async checkEmailAvailability(@Param('email') email: string) {
    const user = await this.usersService.findByEmail(email);
    return { available: !user };
  }

  @Get('check/cpf/:cpf')
  @ApiOperation({ summary: 'Verificar disponibilidade de CPF' })
  @ApiResponse({ status: 200, description: 'CPF disponível ou não' })
  async checkCpfAvailability(@Param('cpf') cpf: string) {
    const user = await this.usersService.findByCpf(cpf);
    return { available: !user };
  }
}
