import { ApiProperty } from '@nestjs/swagger';
import { AtivoResponseDto } from './ativo-response.dto';

export class AtivoListResponseDto {
  @ApiProperty({
    description: 'Lista de ativos',
    type: [AtivoResponseDto],
  })
  data: AtivoResponseDto[];

  @ApiProperty({
    description: 'Total de ativos',
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
