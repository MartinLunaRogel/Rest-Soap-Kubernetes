import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateAlimentoDto {
    @IsString()
    @IsNotEmpty()
    nombre!: string;

    @IsString()
    @IsNotEmpty()
    tipo!: string;

    @IsNumber()
    @IsNotEmpty()
    costo!: number;
    
    [key: string]: any;
}
