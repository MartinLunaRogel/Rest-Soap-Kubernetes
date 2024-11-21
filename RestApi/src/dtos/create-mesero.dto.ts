import { IsString, IsOptional, IsArray, IsUUID } from 'class-validator';

export class CreateMeseroDto {
  @IsString()
  nombre: string;

  @IsString()
  apellido: string;

  @IsOptional()
  @IsArray()
  idMesas?: number[]; // Asegúrate de que este campo sea opcional
}
