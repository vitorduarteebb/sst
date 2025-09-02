import { PartialType } from '@nestjs/swagger';
import { CreateOrdemServicoDto } from './create-ordem-servico.dto';

export class UpdateOrdemServicoDto extends PartialType(CreateOrdemServicoDto) {}
