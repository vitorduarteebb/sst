import { ApiProperty } from '@nestjs/swagger';
import { OrdemServicoResponseDto } from './ordem-servico-response.dto';

export class OrdemServicoListResponseDto {
  @ApiProperty({
    description: 'Lista de ordens de serviço',
    type: [OrdemServicoResponseDto],
  })
  data: OrdemServicoResponseDto[];

  @ApiProperty({
    description: 'Total de ordens de serviço',
    example: 100,
  })
  total: number;

  @ApiProperty({
    description: 'Página atual',
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: 'Itens por página',
    example: 10,
  })
  limit: number;

  @ApiProperty({
    description: 'Total de páginas',
    example: 10,
  })
  totalPages: number;

  @ApiProperty({
    description: 'Indica se há página anterior',
    example: false,
  })
  hasPreviousPage: boolean;

  @ApiProperty({
    description: 'Indica se há próxima página',
    example: true,
  })
  hasNextPage: boolean;
}
