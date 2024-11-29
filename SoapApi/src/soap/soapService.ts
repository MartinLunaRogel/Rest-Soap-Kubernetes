import * as alimentosService from '../services/alimentos.service';

export const soapService = {
    AlimentoService: {
        AlimentoPort: {
            createAlimento: async ({ nombre, tipo, costo }: { nombre: string; tipo: string; costo: number }) => {
                return await alimentosService.createAlimento({ nombre, tipo, costo });
            },
            getAlimentoById: async ({ id }: { id: number }) => {
                return await alimentosService.getAlimentoById(id);
            },
        },
    },
};
