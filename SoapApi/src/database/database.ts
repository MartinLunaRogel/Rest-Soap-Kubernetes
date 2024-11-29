import { Sequelize } from 'sequelize-typescript';
import { Alimento } from '../models/alimento.model';

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite', // Archivo SQLite para la base de datos
    models: [Alimento], // Modelos registrados para la base de datos
});

export default sequelize;
