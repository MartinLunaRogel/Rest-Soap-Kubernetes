import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors, BadRequestException, NotFoundException, ConflictException, InternalServerErrorException, Put } from '@nestjs/common';
import { MesasService } from 'src/services/mesas.service';
import { CreateMesaDto } from 'src/dtos/create-mesa.dto';
import { UpdateMesaDto } from 'src/dtos/update-mesa.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { ValidationErrorException, EmptyFieldException, InvalidFieldException } from 'src/exceptions/exceptions';

@ApiTags('Mesas')
@Controller('mesas')
export class MesasController {
    constructor(private readonly mesasService: MesasService) {}

    @Post()
    @ApiResponse({ status: 201, description: 'Mesa creada exitosamente.' })
    @ApiResponse({ status: 400, description: 'Datos de entrada inválidos.' })
    async create(@Body() createMesaDto: CreateMesaDto) {
        try {
            this.validateCreateMesaDto(createMesaDto);
            const mesa = await this.mesasService.create(createMesaDto);
            return {
                message: 'Mesa creada correctamente',
                data: mesa,
            };
        } catch (error) {
            this.handleException(error);
        }
    }

    @Get()
    @ApiResponse({ status: 200, description: 'Lista de mesas recuperada exitosamente.' })
    @ApiResponse({ status: 400, description: 'Parámetros de consulta inválidos para la paginación.' })
    @UseInterceptors(CacheInterceptor)
    async findAll(
        @Query('filterField') filterField: string,
        @Query('filterValue') filterValue: string,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10
    ) {
        const mesas = await this.mesasService.findAll(filterField, filterValue, page, limit);
        return {
            message: 'Mesas obtenidas correctamente',
            data: mesas,
        };
    }

    @Get(':id')
    @ApiResponse({ status: 200, description: 'Mesa encontrada.' })
    @ApiResponse({ status: 404, description: 'Mesa no encontrada.' })
    @ApiResponse({ status: 400, description: 'ID de mesa inválido.' })
    @UseInterceptors(CacheInterceptor)
    async findOne(@Param('id') id: string) {
        const mesa = await this.mesasService.findOne(+id);
        if (!mesa) {
            throw new NotFoundException('Mesa no encontrada en la base de datos');
        }
        return {
            message: 'Mesa obtenida correctamente',
            data: mesa,
        };
    }

    @Put(':id')
    @ApiResponse({ status: 200, description: 'Mesa actualizada exitosamente.' })
    @ApiResponse({ status: 404, description: 'Mesa no encontrada.' })
    @ApiResponse({ status: 400, description: 'Datos de entrada inválidos o ID de mesa inválido.' })
    async updateMesa(@Param('id') id: number, @Body() updateMesaDto: UpdateMesaDto) {
        try {
            this.validateUpdateMesaDto(updateMesaDto);
            const mesa = await this.mesasService.update(id, updateMesaDto);
            if (!mesa) {
                throw new NotFoundException('Mesa no encontrada');
            }
            return {
                message: 'Mesa actualizada correctamente',
                data: mesa,
            };
        } catch (error) {
            this.handleException(error);
        }
    }


    @Patch(':id')
    @ApiResponse({ status: 200, description: 'Mesa actualizada parcialmente con éxito.' })
    @ApiResponse({ status: 404, description: 'Mesa no encontrada.' })
    @ApiResponse({ status: 400, description: 'Datos de entrada inválidos o ID de mesa inválido.' })
    async update(@Param('id') id: string, @Body() updateMesaDto: UpdateMesaDto) {
        const mesa = await this.mesasService.update(+id, updateMesaDto);
        if (!mesa) {
            throw new NotFoundException('Mesa no encontrada');
        }
        return {
            message: 'Mesa actualizada parcialmente correctamente',
            data: mesa,
        };
    }

    @Delete(':id')
    @ApiResponse({ status: 200, description: 'Mesa eliminada exitosamente.' })
    @ApiResponse({ status: 404, description: 'Mesa no encontrada.' })
    @ApiResponse({ status: 400, description: 'ID de mesa inválido.' })
    async remove(@Param('id') id: string) {
        const mesa = await this.mesasService.findOne(+id);
        if (mesa) {
            try {
                await this.mesasService.remove(+id);
                return {
                    message: 'Mesa eliminada correctamente',
                };
            } catch (error) {
                this.handleException(error);
            }
        }
        throw new NotFoundException("No existe la mesa con ese ID");
    }

    private validateCreateMesaDto(createMesaDto: CreateMesaDto) {
        if (!createMesaDto.tamanoMesa) {
            throw new EmptyFieldException('El campo tamanoMesa es obligatorio');
        }
    }

    private validateUpdateMesaDto(updateMesaDto: UpdateMesaDto) {
        if (!updateMesaDto.tamanoMesa) {
            throw new EmptyFieldException('El campo tamanoMesa es obligatorio');
        }
        if (!updateMesaDto.idProducto) {
          throw new EmptyFieldException('El campo idProducto es obligatorio (ingresar como arreglo)');
        }
        if (!updateMesaDto.totalCuenta) {
            throw new EmptyFieldException('El campo totalCuenta es obligatorio (ingresar como arreglo)');
        }
    }

    private handleException(error: any) {
        if (error instanceof ValidationErrorException) {
            throw new BadRequestException('Datos inválidos: ' + error.message);
        }
        if (error instanceof NotFoundException) {
            throw new NotFoundException('Mesa no encontrada');
        }
        if (error instanceof ConflictException) {
            throw new ConflictException('La mesa ya existe.');
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
