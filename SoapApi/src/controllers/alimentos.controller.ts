import { Controller, Get, Param, Post, Body, Res, ParseIntPipe } from '@nestjs/common';
import { Response } from 'express';
import { AlimentosService } from '../services/alimentos.service';

@Controller('alimentos')
export class AlimentosController {
    constructor(private readonly alimentosService: AlimentosService) {}

    @Get(':id')
    async getAlimentoById(
        @Param('id', ParseIntPipe) id: number,
        @Res() res: Response,
    ) {
        try {
            const alimento = await this.alimentosService.findById(id);
            res.status(200).json(alimento);
        } catch (error) {
            // Tipificar el error para acceder a sus propiedades
            const typedError = error as Error;
            res.status(500).json({
                message: `Error al obtener el alimento: ${typedError.message}`,
                error: 'Internal Server Error',
            });
        }
    }

    @Post()
    async createAlimento(@Body() createAlimentoDto: any, @Res() res: Response) {
        try {
            const nuevoAlimento = await this.alimentosService.create(createAlimentoDto);
            res.status(201).json(nuevoAlimento);
        } catch (error) {
            // Tipificar el error para acceder a sus propiedades
            const typedError = error as Error;
            res.status(500).json({
                message: `Error al crear el alimento: ${typedError.message}`,
                error: 'Internal Server Error',
            });
        }
    }
}
