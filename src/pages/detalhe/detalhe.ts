import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

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
    private youtubeService: YoutubeService) {

    this.playlistItem = navParams.get('item');
    console.log(this.playlistItem);
  }

  ionViewDidLoad() {
    // Recupera detalhes do video
    this.youtubeService.getVideo(this.playlistItem.videoId)
      .subscribe(video => {
        console.log(video);
        this.video = video;
      });
  }

}
