import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put, UseInterceptors, BadRequestException, NotFoundException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { MeserosService } from 'src/services/meseros.service';
import { CreateMeseroDto } from 'src/dtos/create-mesero.dto';
import { UpdateMeseroDto } from 'src/dtos/update-mesero.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { ValidationErrorException, EmptyFieldException, InvalidFieldException } from 'src/exceptions/exceptions';

@ApiTags('Meseros')
@Controller('meseros')
export class MeserosController {
    constructor(private readonly meserosService: MeserosService) {}

    @Post()
    @ApiResponse({ status: 201, description: 'Mesero creado exitosamente.' })
    @ApiResponse({ status: 400, description: 'Datos de entrada inválidos.' })
    async create(@Body() createMeseroDto: CreateMeseroDto) {
        try {
            this.validateCreateMeseroDto(createMeseroDto);
            const mesero = await this.meserosService.create(createMeseroDto);
            return {
                message: 'Mesero creado correctamente',
                data: mesero,
            };
        } catch (error) {
            this.handleException(error);
        }
    }

    @Get()
    @ApiResponse({ status: 200, description: 'Lista de meseros recuperada exitosamente.' })
    @ApiResponse({ status: 400, description: 'Parámetros de consulta inválidos para la paginación.' })
    @UseInterceptors(CacheInterceptor)
    async findAll(
        @Query('filterField') filterField: string,
        @Query('filterValue') filterValue: string,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10
    ) {
        const meseros = await this.meserosService.findAll(filterField, filterValue, page, limit);
        return {
            message: 'Meseros obtenidos correctamente',
            data: meseros,
        };
    }

    @Get(':id')
    @ApiResponse({ status: 200, description: 'Mesero encontrado.' })
    @ApiResponse({ status: 404, description: 'Mesero no encontrado.' })
    @ApiResponse({ status: 400, description: 'ID de mesero inválido.' })
    @UseInterceptors(CacheInterceptor)
    async findOne(@Param('id') id: string) {
        const mesero = await this.meserosService.findOne(id);
        if (!mesero) {
            throw new NotFoundException('Mesero no encontrado en la base de datos');
        }
        return {
            message: 'Mesero obtenido correctamente',
            data: mesero,
        };
    }

    @Put(':id')
    @ApiResponse({ status: 200, description: 'Mesero actualizado exitosamente.' })
    @ApiResponse({ status: 404, description: 'Mesero no encontrado.' })
    @ApiResponse({ status: 400, description: 'Datos de entrada inválidos o ID de mesero inválido.' })
    async updateMesero(@Param('id') id: string, @Body() updateMeseroDto: UpdateMeseroDto) {
        try {
            this.validateUpdateMeseroDto(updateMeseroDto);
            const mesero = await this.meserosService.update(id, updateMeseroDto);
            if (!mesero) {
                throw new NotFoundException('Mesero no encontrado');
            }
            return {
                message: 'Mesero actualizado correctamente',
                data: mesero,
            };
        } catch (error) {
            this.handleException(error);
        }
    }

    @Patch(':id')
    @ApiResponse({ status: 200, description: 'Mesero actualizado parcialmente con éxito.' })
    @ApiResponse({ status: 404, description: 'Mesero no encontrado.' })
    @ApiResponse({ status: 400, description: 'Datos de entrada inválidos o ID de mesero inválido.' })
    async update(@Param('id') id: string, @Body() updateMeseroDto: UpdateMeseroDto) {
        const mesero = await this.meserosService.update(id, updateMeseroDto);
        if (!mesero) {
            throw new NotFoundException('Mesero no encontrado');
        }
        return {
            message: 'Mesero actualizado parcialmente correctamente',
            data: mesero,
        };
    }

    @Delete(':id')
    @ApiResponse({ status: 200, description: 'Mesero eliminado exitosamente.' })
    @ApiResponse({ status: 404, description: 'Mesero no encontrado.' })
    @ApiResponse({ status: 400, description: 'ID de mesero inválido.' })
    async remove(@Param('id') id: string) {
      const mesero = await this.meserosService.findOne(id);
        if (mesero) {
            try {
                await this.meserosService.remove(id);
                return {
                    message: 'Mesero eliminada correctamente',
                };
            } catch (error) {
                this.handleException(error);
            }
        }
        throw new NotFoundException("No existe MEsero con ese ID");
    }

    private validateCreateMeseroDto(createMeseroDto: CreateMeseroDto) {
        if (!createMeseroDto.nombre) {
            throw new EmptyFieldException('El campo nombre es obligatorio');
        }
        if (!createMeseroDto.idMesas) {
          throw new EmptyFieldException('El campo idMesas es obligatorio (ingresar como arreglo)');
      }    }

    private validateUpdateMeseroDto(updateMeseroDto: UpdateMeseroDto) {
        if (!updateMeseroDto.nombre) {
            throw new EmptyFieldException('El campo nombre es obligatorio');
        }
        if (!updateMeseroDto.apellido) {
          throw new EmptyFieldException('El campo apellido es obligatorio');
        }  
        if (!updateMeseroDto.idMesas) {
          throw new EmptyFieldException('El campo idMesas es obligatorio');
        }   
      }

    private handleException(error: any) {
        if (error instanceof ValidationErrorException) {
            throw new BadRequestException('Datos inválidos: ' + error.message);
        }
        if (error instanceof NotFoundException) {
            throw new NotFoundException('Mesero no encontrado');
        }
        if (error instanceof ConflictException) {
            throw new ConflictException('El mesero ya existe.');
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
