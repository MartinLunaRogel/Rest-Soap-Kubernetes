import { PartialType } from '@nestjs/mapped-types';
import { CreateMeseroDto } from './create-mesero.dto';

export class UpdateMeseroDto extends PartialType(CreateMeseroDto) {}
