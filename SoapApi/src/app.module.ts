import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AlimentosModule } from './modules/alimentos.modules';
import { Alimento } from './models/alimento.model';

@Module({
    imports: [
        SequelizeModule.forRoot({
            dialect: 'sqlite',
            storage: './database.sqlite', // Ruta donde se guardará la base de datos
            models: [Alimento], // Modelos que utilizarás
            autoLoadModels: true,
            synchronize: true,
        }),
        AlimentosModule, // Módulo de alimentos
    ],
})
export class AppModule {}
