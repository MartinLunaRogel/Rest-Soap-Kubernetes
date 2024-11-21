import { IsString, IsNumber, isArray, IsOptional } from 'class-validator';

export class CreateMesaDto {
  @IsString()
  tamanoMesa: string;

  @IsOptional()
  @IsNumber()
  totalCuenta: number;

  @IsOptional()
  idProducto: number[];
}
