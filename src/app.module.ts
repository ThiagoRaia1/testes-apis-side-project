import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SpotifyModule } from './spotify/spotify.module';
import { ConfigModule } from '@nestjs/config';
import { TmdbModule } from './tmdb/tmdb.module';
import { RawgModule } from './rawg/rawg.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SpotifyModule,
    TmdbModule,
    RawgModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
