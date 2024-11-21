import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAlimentoDto } from 'src/dtos/create-alimento.dto';
import { UpdateAlimentoDto } from 'src/dtos/update-alimento.dto';
import { Alimento } from 'src/entities/alimento.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from '@nestjs/cache-manager';

@Injectable()
export class AlimentosService {
    constructor(
        @InjectRepository(Alimento)
        private alimentoRepository: Repository<Alimento>,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) {}

    create(createAlimentoDto: CreateAlimentoDto) {
        const alimento = this.alimentoRepository.create(createAlimentoDto);
        return this.alimentoRepository.save(alimento);
    }

    async findAll(filterField: string, filterValue: string, page: number, limit: number) {
        const [items, total] = await this.alimentoRepository.findAndCount({
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

    findOne(id: number) {
        const alimento = this.alimentoRepository.findOneBy({ idProducto: id });
        if (!alimento) throw new NotFoundException(`Alimento con ID ${id} no encontrado`);
        return alimento;
    }

    async updateAlimento(id: number, updateAlimentoDto: UpdateAlimentoDto): Promise<Alimento> {
        const alimento = await this.alimentoRepository.findOneBy({ idProducto: id });
        
        if (!alimento) {
          throw new NotFoundException(`Alimento con ID ${id} no encontrado`);
        }
    
        Object.assign(alimento, updateAlimentoDto);
        const updatedAlimento = await this.alimentoRepository.save(alimento);
        await this.cacheManager.store.reset();
        return updatedAlimento;
    }

    async update(id: number, updateAlimentoDto: UpdateAlimentoDto): Promise<Alimento> {
        const alimentoToUpdate = await this.alimentoRepository.preload({
            idProducto: id,
            ...updateAlimentoDto,
        });
        if (!alimentoToUpdate) throw new NotFoundException("Alimento no encontrado");

        const updatedAlimento = await this.alimentoRepository.save(alimentoToUpdate);
        await this.cacheManager.store.reset();
        return updatedAlimento;
    }

    remove(id: number) {
        this.cacheManager.store.reset();
        return this.alimentoRepository.delete({ idProducto: id });
      }
}
