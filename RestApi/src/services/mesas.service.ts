import { Inject, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMesaDto } from 'src/dtos/create-mesa.dto';
import { UpdateMesaDto } from 'src/dtos/update-mesa.dto';
import { Mesa } from 'src/entities/mesa.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from '@nestjs/cache-manager';
import axios from 'axios'; // Usaremos Axios para consultar la API SOAP.

@Injectable()
export class MesasService {
  constructor(
    @InjectRepository(Mesa)
    private mesasRepository: Repository<Mesa>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(createMesaDto: CreateMesaDto) {
    await this.validateProductos(createMesaDto.idProducto);
    const mesa = this.mesasRepository.create(createMesaDto);
    return this.mesasRepository.save(mesa);
  }

  async findAll(filterField: string, filterValue: string, page: number, limit: number) {
    const [items, total] = await this.mesasRepository.findAndCount({
      where: { [filterField]: filterValue },
      take: limit,
      skip: (page - 1) * limit,
    });
    
    return {
      data: items,
      total,
      page,
      limit,
    };
  }

  async findOne(id: number) {
    const mesa = await this.mesasRepository.findOneBy({ idMesa: id });
    if (!mesa) throw new NotFoundException("Mesa no encontrada");
    return mesa;
  }

  async updateMesa(id: number, updateMesaDto: UpdateMesaDto): Promise<Mesa> {
    await this.validateProductos(updateMesaDto.idProducto);
    const mesa = await this.mesasRepository.findOneBy({ idMesa: id });
    if (!mesa) {
      throw new NotFoundException(`Mesa con ID ${id} no encontrada`);
    }

    Object.assign(mesa, updateMesaDto);
    const updatedMesa = await this.mesasRepository.save(mesa);
    await this.cacheManager.store.reset();
    return updatedMesa;
  }

  async update(id: number, updateMesaDto: UpdateMesaDto) {
    await this.validateProductos(updateMesaDto.idProducto);
    const mesaToUpdate = await this.mesasRepository.preload({
      idMesa: id,
      ...updateMesaDto,
    });
    if (!mesaToUpdate) throw new NotFoundException("Mesa no encontrada");
    const updatedMesa = await this.mesasRepository.save(mesaToUpdate);
    await this.cacheManager.store.reset();
    return updatedMesa;
  }

  async remove(id: number) {
    this.cacheManager.store.reset();
    return this.mesasRepository.delete({ idMesa: id });
  }

  // Validar existencia de productos en la API SOAP.
  private async validateProductos(productos: number[]) {
    if (!productos || productos.length === 0) return;

    for (const id of productos) {
      try {
        const response = await axios.get(`http://soap-api:4000/api/alimentos/${id}`);
        if (response.status !== 200) {
          throw new Error(`Producto con ID ${id} no encontrado`);
        }
      } catch (error) {
        throw new BadRequestException(`Producto con ID ${id} no encontrado`);
      }
    }
  }
}
