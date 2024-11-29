import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { MeserosModule } from 'src/modules/meseros.module';
import { MesasModule } from 'src/modules/mesas.module';
import { CacheModule } from './modules/cache.module';
import { AlimentosController } from './controllers/alimentos.controller';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.host,
      port: +process.env.port,
      username: 'postgres',
      password: process.env.pass,
      database: process.env.name,
      entities: [],
      autoLoadEntities: true,
      synchronize: true,
    }),
    MesasModule,
    MeserosModule,
    CacheModule,
  ],
  controllers: [AlimentosController],
  providers: [],
})
export class AppModule {}
