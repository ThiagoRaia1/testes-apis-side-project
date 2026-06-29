import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Query,
} from '@nestjs/common';
import { SpotifyService } from './spotify.service';
import { CreateSpotifyDto } from './dto/create-spotify.dto';
import { UpdateSpotifyDto } from './dto/update-spotify.dto';
import express from 'express';
import axios from 'axios';

@Controller('spotify')
export class SpotifyController {
  constructor(private readonly spotifyService: SpotifyService) {}

  @Post()
  create(@Body() createSpotifyDto: CreateSpotifyDto) {
    return this.spotifyService.create(createSpotifyDto);
  }

  @Get()
  login(@Res() res: express.Response) {
    const scopes = ['user-top-read']; // nível de permissão solicitado

    const url =
      'https://accounts.spotify.com/authorize?' +
      new URLSearchParams({
        client_id: process.env.SPOTIFY_CLIENT_ID!,
        response_type: 'code',
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI!,
        scope: scopes.join(' '),
        show_dialog: 'true', // mostra a tela de login toda vez que acessar a rota
      }).toString();
    console.log(url);
    return res.redirect(url);
  }

  @Get('callback')
  async callback(@Query('code') code: string) {
    const tokenResponse = await axios.post(
      'https://accounts.spotify.com/api/token',
      new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI!,
      }),
      {
        headers: {
          Authorization:
            'Basic ' +
            Buffer.from(
              `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`,
            ).toString('base64'),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );

    const accessToken = tokenResponse.data.access_token;

    const artists = await axios.get(
      'https://api.spotify.com/v1/me/top/artists?limit=5',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    return artists.data.items;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.spotifyService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSpotifyDto: UpdateSpotifyDto) {
    return this.spotifyService.update(+id, updateSpotifyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.spotifyService.remove(+id);
  }
}
