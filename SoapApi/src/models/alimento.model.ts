import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'alimentos', timestamps: true })
export class Alimento extends Model {
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    nombre!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    tipo!: string;

    @Column({
        type: DataType.FLOAT,
        allowNull: false,
    })
    costo!: number;
}
