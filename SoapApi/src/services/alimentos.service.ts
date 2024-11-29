import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Alimento } from '../models/alimento.model';
import { CreateAlimentoDto } from '../dtos/create-alimento.dto';

@Injectable()
export class AlimentosService {
    constructor(
        @InjectModel(Alimento)
        private readonly alimentoModel: typeof Alimento,
    ) {}

    async create(createAlimentoDto: CreateAlimentoDto): Promise<Alimento> {
        try {
            const alimento = await this.alimentoModel.create({
                ...createAlimentoDto,
            });
            return alimento;
        } catch (error: any) { // El tipo explícito "any" puede cambiarse según el caso
            throw new InternalServerErrorException(
                `Error al crear el alimento: ${error.message || 'Error desconocido'}`,
            );
        }
    }

    async findById(id: number): Promise<Alimento> {
        try {
            const alimento = await this.alimentoModel.findByPk(id);
            if (!alimento) {
                throw new NotFoundException('Alimento no encontrado');
            }
            return alimento;
        } catch (error: any) {
            throw new InternalServerErrorException(
                `Error al obtener el alimento: ${error.message || 'Error desconocido'}`,
            );
        }
    }
}
