import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { MeserosModule } from 'src/modules/meseros.module';
import { MesasModule } from 'src/modules/mesas.module';
import { AlimentosModule } from 'src/modules/alimentos.module';
import { CacheModule } from './modules/cache.module';

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
    AlimentosModule,
    MesasModule,
    MeserosModule,
    CacheModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
