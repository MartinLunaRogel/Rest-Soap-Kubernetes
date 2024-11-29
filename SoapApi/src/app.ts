import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import sequelize from './database/database';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Sincronización con la base de datos
    await sequelize.sync({ alter: true });
    console.log('Base de datos sincronizada correctamente.');

    await app.listen(4000);
    console.log('Aplicación corriendo en http://localhost:4000');
}
bootstrap();
