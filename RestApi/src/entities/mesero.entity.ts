import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Mesa } from './mesa.entity';

@Entity()
export class Mesero {
  @PrimaryGeneratedColumn('uuid')
  idMesero: string;

  @Column()
  nombre: string;

  @Column()
  apellido: string;

  @OneToMany(() => Mesa, (mesa) => mesa.idMesero, { cascade: true })
  mesas: Mesa[]; // Cambiado a una relación con la entidad Mesa
}
