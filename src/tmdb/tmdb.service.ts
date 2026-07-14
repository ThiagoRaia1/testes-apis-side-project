import { Injectable } from '@nestjs/common';
import { CreateTmdbDto } from './dto/create-tmdb.dto';
import { UpdateTmdbDto } from './dto/update-tmdb.dto';
import axios from 'axios';

@Injectable()
export class TmdbService {
  create(createTmdbDto: CreateTmdbDto) {
    return 'This action adds a new tmdb';
  }

  findAll() {
    return `This action returns all tmdb`;
  }

  async findOne(id: number) {
    const response = await axios.get(
      'https://api.themoviedb.org/3/search/movie',
      {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
        },
        params: {
          query: 'How to train your dragon',
          language: 'pt-BR',
        },
      },
    );

    return response.data;
  }

  update(id: number, updateTmdbDto: UpdateTmdbDto) {
    return `This action updates a #${id} tmdb`;
  }

  remove(id: number) {
    return `This action removes a #${id} tmdb`;
  }
}
