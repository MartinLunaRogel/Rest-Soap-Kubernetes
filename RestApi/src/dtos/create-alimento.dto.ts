import { IsString, IsNumber, IsArray, MaxLength } from 'class-validator';

export class CreateAlimentoDto {
    @IsString()
    @MaxLength(100)
    nombre: string;

    @IsString()
    tipo: string;

    @IsNumber()
    costo: number;
}
