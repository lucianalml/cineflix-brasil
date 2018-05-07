import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';

import { PlaylistItem } from '../../models/playlistItem';

import { YoutubeService } from '../../services/youtube';
import { Video } from '../../models/video';

/**
 * Generated class for the DetalhePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-detalhe',
  templateUrl: 'detalhe.html',
})
export class DetalhePage {

  playlistItem: PlaylistItem;
  video: Video;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private platform: Platform,
    private youtubeService: YoutubeService) {

    this.playlistItem = navParams.get('item');
  }

  ionViewDidLoad() {
    // Recupera detalhes do video
    this.youtubeService.getVideo(this.playlistItem.videoId)
      .subscribe(video => {
        this.video = video;
      });
  }

  onOpenVideo(){

      const videoUrl = 'https://www.youtube.com/watch?v=' + this.video.id;
      // const videoUrl = 'https://www.youtube.com/v=' + this.video.id;
      // const videoUrl = 'https://www.youtube.com/watch_popup?v=' + this.video.id;
      // const videoUrl = 'https://www.youtube.com/embed/' + this.video.id;

      // window.open(videoUrl);

    if (this.platform.is('cordova')) {
      window.open(videoUrl, "_system");
    } else {
      window.open(videoUrl);
    }

  }

  setDetalheFilme(detalhe){
    if(detalhe && detalhe.length > 200)
      return detalhe.substring(-1, 199) + "...";
    else
      return detalhe;
  }

}
