import { PartialType } from '@nestjs/mapped-types';
import { CreateTmdbDto } from './create-tmdb.dto';

export class UpdateTmdbDto extends PartialType(CreateTmdbDto) {}
