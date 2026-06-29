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
  async callback(@Query('code') code: string, @Res() res: express.Response) {
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

    const html = `
<html>
  <head>
    <title>Spotify Top Artists</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background: #121212;
        color: white;
        margin: 0;
        padding: 20px;
      }

      h1 {
        text-align: center;
        margin-bottom: 30px;
      }

      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 20px;
      }

      .card {
        background: #181818;
        padding: 15px;
        border-radius: 12px;
        text-align: center;
        transition: 0.2s;
      }

      .card:hover {
        transform: scale(1.05);
        background: #282828;
      }

      img {
        width: 100%;
        border-radius: 10px;
      }

      .name {
        margin-top: 10px;
        font-size: 16px;
        font-weight: bold;
      }

      .popularity {
        font-size: 12px;
        color: #b3b3b3;
        margin-top: 5px;
      }
    </style>
  </head>

  <body>
    <h1>🎧 Seus 5 artistas mais ouvidos</h1>

    <div class="grid">
      ${artists.data.items
        .map(
          (a: any) => `
        <div class="card">
          <img
  src="${a.images?.[0]?.url}"
  style="
    width: 240px;
    height: 240px;
    object-fit: cover;
    object-position: center;
    border-radius: 12px;
    display: block;
    margin: 0 auto 10px auto;
    box-shadow: 0 4px 20px rgba(0,0,0,0.4);
  "
/>
          <div class="name">${a.name}</div>
        </div>
      `,
        )
        .join('')}
    </div>
  </body>
</html>
`;

    return res.send(html);
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
