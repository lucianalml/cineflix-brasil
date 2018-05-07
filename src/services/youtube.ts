import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import 'rxjs/Rx';

import { Playlist } from '../models/playlist';
import { PlaylistItem } from '../models/playlistItem';
import { Video } from '../models/video';

@Injectable()
export class YoutubeService {

  private channelId = 'UC2dAdLOJZiQsSFjcTsERsDA';
  private apiKey = 'AIzaSyBftDhqCdhKRvul673QbydsBPoqwbvBui0';

  constructor(private http: Http) {}

  getVideo(id: string) {
    return this.http.get('https://www.googleapis.com/youtube/v3/videos?id='
    + id
    + '&part=snippet&key='
    + this.apiKey)
    .map(this.extractVideo);

    // TODO -> forkJoin para recuperar player
    // let videoPlayerEndpoint = 'https://www.googleapis.com/youtube/v3/videos?id=' + id
    // + '&part=player&key=' + this.apiKey;

  }

  extractVideo(response : Response) : Video {
    if (!response.json()) {
      return null;
    }

    // Recupra os detalhes do primeiro item
    if (response.json().items.length == 0 ) {
      return null;
    }

    let item = response.json().items[0];

    return new Video(item.id,
        item.snippet.title,
        item.snippet.description,
        { default: item.snippet.thumbnails.default.url,
          high: item.snippet.thumbnails.high.url,
          medium: item.snippet.thumbnails.medium.url },
        item.snippet.tags
      );
  }

  // Recupera todas as playlists to canal
  fetchPlaylistsFromChannel() {
    return this.http.get('https://www.googleapis.com/youtube/v3/playlists?channelId='
      + this.channelId
      + '&maxResults=50'
      + '&part=snippet&key='
      + this.apiKey)
      .map(this.extractPlaylists);
    }

    extractPlaylists(response : Response){
      if (!response.json()) {
        return [];
      }
      return response.json().items.map(item => new Playlist(item.id, item.snippet.title));
    }

    getPlaylistItems(playlistId: string){
      return this.http.get('https://www.googleapis.com/youtube/v3/playlistItems?playlistId='
        + playlistId
        + '&maxResults=50'
        + '&part=snippet&key='
        + this.apiKey)
        .map(this.extractPlaylistItems);

        // TODO para cada item da playlist buscar as estatisticas do vídeo em
        // https://www.googleapis.com/youtube/v3/videos?id=xKE3lfwMb1Y&part=statistics
        // para melhorar algoritmo de sorteio
    }

    extractPlaylistItems(response: Response) : PlaylistItem[] {

      if (!response.json()) {
        // return [];
        return null;
      }

      return response.json().items.map(item => {

          if ( !item || !item.snippet || !item.snippet.thumbnails ) {
            return null;
          }

          let playlistItem = new PlaylistItem(item.id,
            item.snippet.title,
            item.snippet.description,
            { default: item.snippet.thumbnails.default.url,
              high: item.snippet.thumbnails.high.url,
              medium: item.snippet.thumbnails.medium.url },
            item.snippet.publishedAt,
            item.snippet.resourceId.videoId
          );

          return playlistItem;
        }
      );
    }
  }
