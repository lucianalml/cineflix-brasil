import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';

import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player';

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
    private youtube: YoutubeVideoPlayer,
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

    // // console.log(this.video);
    if (this.platform.is('cordova')) {
      // this.youtube.openVideo(this.video.id);
      window.open('https://www.youtube.com/watch?v=' + this.video.id, "_system", "location=yes");
    } else {
      window.open('https://www.youtube.com/watch?v=' + this.video.id);
    }

    // window.open('https://www.youtube.com/watch?v=' + this.video.id);
    // window.open('https://www.youtube.com/watch?v=' + this.video.id);

  }

}
