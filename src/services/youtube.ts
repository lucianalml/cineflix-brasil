import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import 'rxjs/Rx';

import { Filme } from '../models/filme';
import { Playlist } from '../models/playlist';

@Injectable()
export class YoutubeService {
  private filme: Filme;

  private channelId = 'UC2dAdLOJZiQsSFjcTsERsDA';
  private apiKey = 'AIzaSyBftDhqCdhKRvul673QbydsBPoqwbvBui0';

  constructor(private http: Http) {}

  getFilme() {
    return this.filme;

    // const userId = this.authService.getActiveUser().uid;
    // return this.http.get('https://ionic2-recipebook.firebaseio.com/' + userId + '/recipes.json?auth=' + token, this.recipes)
    //   .map((response: Response) => response.json());

  }

  fetchPlaylists() {

    return this.http.get('https://www.googleapis.com/youtube/v3/playlists?channelId=' 
      + this.channelId
      + '&part=snippet&key=' 
      + this.apiKey)
      .map((response: Response) => {
          return response.json();
        }
      );

    }
}
