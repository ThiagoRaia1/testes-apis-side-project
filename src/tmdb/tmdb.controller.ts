import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TmdbService } from './tmdb.service';
import { CreateTmdbDto } from './dto/create-tmdb.dto';
import { UpdateTmdbDto } from './dto/update-tmdb.dto';

@Controller('tmdb')
export class TmdbController {
  constructor(private readonly tmdbService: TmdbService) {}

  @Post()
  create(@Body() createTmdbDto: CreateTmdbDto) {
    return this.tmdbService.create(createTmdbDto);
  }

  @Get()
  findAll() {
    return this.tmdbService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tmdbService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTmdbDto: UpdateTmdbDto) {
    return this.tmdbService.update(+id, updateTmdbDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tmdbService.remove(+id);
  }
}
