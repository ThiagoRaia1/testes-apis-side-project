import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RawgService } from './rawg.service';
import { CreateRawgDto } from './dto/create-rawg.dto';
import { UpdateRawgDto } from './dto/update-rawg.dto';
import axios from 'axios';

@Controller('rawg')
export class RawgController {
  constructor(private readonly rawgService: RawgService) {}

  @Post()
  create(@Body() createRawgDto: CreateRawgDto) {
    return this.rawgService.create(createRawgDto);
  }

  @Get()
  findAll() {
    return this.rawgService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const response = await axios.get('https://api.rawg.io/api/games', {
      params: {
        key: process.env.RAWG_API_KEY,
        search: 'The Last Of Us',
      },
    });

    return response.data.results;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRawgDto: UpdateRawgDto) {
    return this.rawgService.update(+id, updateRawgDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rawgService.remove(+id);
  }
}
