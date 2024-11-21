import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Mesero } from './mesero.entity';

@Entity()
export class Mesa {
  @PrimaryGeneratedColumn('increment')
  idMesa: number;

  @Column({ type: 'text' })
  tamanoMesa: string;

  @Column('float', { nullable: true, default: 0 }) // Valor inicial para totalCuenta
  totalCuenta: number;

  @Column('int', { array: true, default: [] }) // Para almacenar el array de productos
  idProducto: number[];

  @ManyToOne(() => Mesero, (mesero) => mesero.mesas, { nullable: true })
  idMesero: Mesero; // Referencia a la entidad Mesero
}
