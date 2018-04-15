import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";

import { NavController, AlertController, Platform } from 'ionic-angular';

import { DetalhePage } from "../detalhe/detalhe";

import { Playlist } from './../../models/playlist';
import { PlaylistItem } from '../../models/playlistItem';

import { YoutubeService } from '../../services/youtube';

@Component({
  selector: "page-home",
  templateUrl: "home.html"
})
export class HomePage {

  detalhePage = DetalhePage;

  generoSelected = 'TODOS';
  generoList = [{ id: 'TODOS', nome: "Todos" }];

  playlists: Playlist[];
  randomItem : PlaylistItem;

  constructor(public navCtrl: NavController,
    private alertCtrl: AlertController,
    private platform: Platform,
    private youtubeService: YoutubeService) { }


  ionViewWillEnter() {

// Recupera playlists do canal
    this.youtubeService.fetchPlaylistsFromChannel().subscribe((playlists) => {

        this.playlists = playlists;

        // Cria lista com gêneros recuperando os títulos das playlists
        this.generoList = [{ id: 'TODOS', nome: "Todos" }];
        for (let i = 0; i < this.playlists.length; i++) {
          this.generoList.push({id: this.playlists[i].id,
                                nome: this.playlists[i].title });
        }
      },
      error => {
        console.log(error.json());
      }
    );
  }

  onRandomButton(form: NgForm){

    let playlistId = this.generoSelected;

    // Fazer a busca em todas as playlists
    if (this.generoSelected == 'TODOS') {

      // Recupera uma playlist aleatória entre todas
      playlistId = this.playlists[Math.floor(Math.random() * this.playlists.length)].id;
    }

      // Recupera um video aleatório na playlist selecionada
      this.youtubeService.getPlaylistItems(playlistId)
      .subscribe(playlistItems => {

        if (playlistItems.length == 0) {
          return;
        }

        this.randomItem = playlistItems[Math.floor(Math.random() * playlistItems.length)];
        // console.log(this.randomItem);
      });
  }

  // Página de detalhe
  onGoToDetalhe() {
    this.navCtrl.push(DetalhePage, { item: this.randomItem } );
  }

  // Teste deploy
  showPlatform() {
    let text = 'I run on: ' + this.platform.platforms();
    let alert = this.alertCtrl.create({
      title: 'My Home',
      subTitle: text,
      buttons: ['Ok']
    });
    alert.present();
  }
}
