import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Alimento {
    @PrimaryGeneratedColumn('increment')
    idProducto: number;

    @Column({ type: 'text', unique: true })
    nombre: string;

    @Column({ type: 'text' })
    tipo: string;

    @Column({ type: 'float' })
    costo: number;
}
