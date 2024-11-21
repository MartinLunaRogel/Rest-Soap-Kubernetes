import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put, UseInterceptors, BadRequestException, NotFoundException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { AlimentosService } from 'src/services/alimentos.service';
import { CreateAlimentoDto } from 'src/dtos/create-alimento.dto';
import { UpdateAlimentoDto } from 'src/dtos/update-alimento.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { ValidationErrorException, EmptyFieldException, InvalidFieldException } from 'src/exceptions/exceptions';

@ApiTags('Alimentos y Bebidas')
@Controller('alimentos')
export class AlimentosController {
    constructor(private readonly alimentosService: AlimentosService) {}

    @Post()
    @ApiResponse({ status: 201, description: 'Producto creado exitosamente.' })
    @ApiResponse({ status: 400, description: 'Datos de entrada inválidos.' })
    async create(@Body() createAlimentoDto: CreateAlimentoDto) {
        try {
            this.validateCreateAlimentoDto(createAlimentoDto);
            const alimento = await this.alimentosService.create(createAlimentoDto);
            return {
                message: 'Alimento creado correctamente',
                data: alimento,
            };
        } catch (error) {
            this.handleException(error);
        }
    }

    @Get()
    @ApiResponse({ status: 200, description: 'Lista de productos recuperada exitosamente.' })
    @ApiResponse({ status: 400, description: 'Parámetros de consulta inválidos para la paginación.' })
    @UseInterceptors(CacheInterceptor)
    async findAll(
        @Query('filterField') filterField: string,
        @Query('filterValue') filterValue: string,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10
    ) {
        const alimentos = await this.alimentosService.findAll(filterField, filterValue, page, limit);
        return {
            message: 'Alimentos obtenidos correctamente',
            data: alimentos,
        };
    }

    @Get(':id')
    @ApiResponse({ status: 200, description: 'Producto encontrado.' })
    @ApiResponse({ status: 404, description: 'Producto no encontrado.' })
    @ApiResponse({ status: 400, description: 'ID de producto inválido.' })
    @UseInterceptors(CacheInterceptor)
    async findOne(@Param('id') id: string) {
        const alimento = await this.alimentosService.findOne(+id);
        if (!alimento) {
            throw new NotFoundException('Alimento no encontrado en la base de datos');
        }
        return {
            message: 'Alimento obtenido correctamente',
            data: alimento,
        };
    }

    @Put(':id')
    @ApiResponse({ status: 200, description: 'Producto actualizado exitosamente.' })
    @ApiResponse({ status: 404, description: 'Producto no encontrado.' })
    @ApiResponse({ status: 400, description: 'Datos de entrada inválidos o ID de producto inválido.' })
    async updateAlimento(@Param('id') id: number, @Body() updateAlimentoDto: UpdateAlimentoDto) {
        try {
            this.validateUpdateAlimentoDto(updateAlimentoDto);
            const alimento = await this.alimentosService.updateAlimento(id, updateAlimentoDto);
            return {
                message: 'Alimento actualizado correctamente',
                data: alimento,
            };
        } catch (error) {
            this.handleException(error);
        }
    }

    @Patch(':id')
    @ApiResponse({ status: 200, description: 'Producto actualizado parcialmente con éxito.' })
    @ApiResponse({ status: 404, description: 'Producto no encontrado.' })
    @ApiResponse({ status: 400, description: 'Datos de entrada inválidos o ID de producto inválido.' })
    async update(@Param('id') id: string, @Body() updateAlimentoDto: UpdateAlimentoDto) {
        const alimento = await this.alimentosService.update(+id, updateAlimentoDto);
        if (!alimento) {
            throw new NotFoundException('Alimento no encontrado');
        }
        return {
            message: 'Alimento actualizado parcialmente correctamente',
            data: alimento,
        };
    }

    @Delete(':id')
    @ApiResponse({ status: 200, description: 'Producto eliminado exitosamente.' })
    @ApiResponse({ status: 404, description: 'Producto no encontrado.' })
    @ApiResponse({ status: 400, description: 'ID de producto inválido.' })
    async remove(@Param('id') id: string) {
        const alimento = await this.alimentosService.findOne(+id);
        if (alimento){
            try {
                await this.alimentosService.remove(+id);
                return {
                    message: 'Alimento eliminado correctamente',
                };
            } catch (error) {
                this.handleException(error);
            }
        }
        throw new NotFoundException("no existe el alimento con ese id");
        
    }

    private validateCreateAlimentoDto(createAlimentoDto: CreateAlimentoDto) {
        if (!createAlimentoDto.nombre) {
            throw new EmptyFieldException('El campo nombre es obligatorio');
        }
        if (!createAlimentoDto.tipo) {
            throw new EmptyFieldException('El campo tipo es obligatorio');
        }
        if (!createAlimentoDto.costo) {
            throw new EmptyFieldException('El costo tipo es obligatorio');
        }    }

    private validateUpdateAlimentoDto(updateAlimentoDto: UpdateAlimentoDto) {
        if (!updateAlimentoDto.nombre) {
            throw new EmptyFieldException('El campo nombre es obligatorio');
        }
        if (!updateAlimentoDto.tipo) {
            throw new EmptyFieldException('El campo tipo es obligatorio');
        }
        if (!updateAlimentoDto.costo) {
            throw new EmptyFieldException('El campo costo es obligatorio');
        }    }

    private handleException(error: any) {
        if (error instanceof ValidationErrorException) {
            throw new BadRequestException('Datos inválidos: ' + error.message);
        }
        if (error instanceof NotFoundException) {
            throw new NotFoundException('Alimento no encontrado');
        }
        if (error instanceof ConflictException) {
            throw new ConflictException('El alimento ya existe.');
        }
        if (error instanceof EmptyFieldException) {
            throw new BadRequestException('Faltan campos obligatorios: ' + error.message);
        }
        if (error instanceof InvalidFieldException) {
            throw new BadRequestException('Campo inválido: ' + error.message);
        }
        throw new InternalServerErrorException('Error inesperado al procesar la solicitud.');
    }
}
