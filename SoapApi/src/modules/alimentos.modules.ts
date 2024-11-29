import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Alimento } from '../models/alimento.model';
import { AlimentosService } from '../services/alimentos.service';
import { AlimentosController } from '../controllers/alimentos.controller';

@Module({
    imports: [SequelizeModule.forFeature([Alimento])],
    controllers: [AlimentosController],
    providers: [AlimentosService],
})
export class AlimentosModule {}
