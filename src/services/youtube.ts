import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import 'rxjs/Rx';

import { Filme } from '../models/filme';
import { Playlist } from '../models/playlist';
import { PlaylistItem } from '../models/playlistItem';

@Injectable()
export class YoutubeService {
  private filme: Filme;
  private playlists: Playlist[];

  private channelId = 'UC2dAdLOJZiQsSFjcTsERsDA';
  private apiKey = 'AIzaSyBftDhqCdhKRvul673QbydsBPoqwbvBui0';

  constructor(private http: Http) {}

  getFilme() {
    return this.filme;
    // const userId = this.authService.getActiveUser().uid;
    // return this.http.get('https://ionic2-recipebook.firebaseio.com/' + userId + '/recipes.json?auth=' + token, this.recipes)
    //   .map((response: Response) => response.json());
  }

  // Recupera todas as playlists to canal
  fetchPlaylists() {
    return this.http.get('https://www.googleapis.com/youtube/v3/playlists?channelId='
      + this.channelId
      + '&part=snippet&key='
      + this.apiKey)
      .map(this.extractPlaylists);
      // .do((playlists: Playlist[]) => {
      //   if (playlists) {
      //     this.playlists = playlists;
      //   } else {
      //     this.playlists = [];
      //   }
      // });
    }

    extractPlaylists(response : Response){
      console.log("Playlists do canal", response.json());
      if (!response.json()) {
        return [];
      }
      return response.json().items.map(item => new Playlist(item.id, item.snippet.title));
    }

    getPlaylistItems(playlistId:string){
      return this.http.get('https://www.googleapis.com/youtube/v3/playlistItems?playlistId='
        + playlistId
        + '&part=snippet&key='
        + this.apiKey)
        // .map((response: Response) => response.json());
        .map(this.extractPlaylistItems);
    }

    extractPlaylistItems(response : Response){
      console.log("Itens da playlist", response.json());
      if (!response.json()) {
        return [];
      }
      return response.json().items.map(item =>
        {
          let thumbnails = {
            default: item.snippet.thumbnails.default.url,
            high: item.snippet.thumbnails.high.url,
            medium: item.snippet.thumbnails.medium.url
          };

          let playlistItem = new PlaylistItem(item.id,
            item.snippet.title,
            item.snippet.description,
            thumbnails,
            item.snippet.publishedAt);

          return playlistItem;
        }
      );
    }
  }
