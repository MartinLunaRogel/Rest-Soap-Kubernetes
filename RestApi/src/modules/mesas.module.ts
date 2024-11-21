import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MesasService } from 'src/services/mesas.service';
import { MesasController } from 'src/controllers/mesas.controller';
import { Mesa } from '../entities/mesa.entity';
import { CacheModule } from './cache.module';

@Module({
  imports: [TypeOrmModule.forFeature([Mesa]),
  CacheModule
  ],
  controllers: [MesasController],
  providers: [MesasService],
})
export class MesasModule {}
