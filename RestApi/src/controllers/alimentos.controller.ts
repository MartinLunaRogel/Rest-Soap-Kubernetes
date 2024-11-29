import { Controller, Post, Get, Body, Param, InternalServerErrorException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import * as soap from 'soap';
import { promisify } from 'util';

const soapUrl = 'http://soap-api:4000/wsdl';
const createClientAsync = promisify(soap.createClient);

@ApiTags('Alimentos')
@Controller('alimentos')
export class AlimentosController {
    @Post()
    async createAlimento(@Body() body: any) {
        try {
            const client = await createClientAsync(soapUrl);
            const createAlimento = promisify(client['createAlimento'].bind(client));
            const result = await createAlimento(body);
            return result;
        } catch (error) {
            throw new InternalServerErrorException(`Error al crear el alimento: ${error.message}`);
        }
    }

    @Get(':id')
    async getAlimentoById(@Param('id') id: string) {
        try {
            const client = await createClientAsync(soapUrl);
            const getAlimentoById = promisify(client['getAlimentoById'].bind(client));
            const result = await getAlimentoById({ id });
            return result;
        } catch (error) {
            throw new InternalServerErrorException(`Error al obtener el alimento: ${error.message}`);
        }
    }
}
