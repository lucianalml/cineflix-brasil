import { Component } from "@angular/core";
import { NavController, AlertController, Platform } from 'ionic-angular';

import { DetalhePage } from "../detalhe/detalhe";

import { Filme } from './../../models/filme';
import { Playlist } from './../../models/playlist';
import { PlaylistItem } from '../../models/playlistItem';

import { YoutubeService } from '../../services/youtube';

@Component({
  selector: "page-home",
  templateUrl: "home.html"
})
export class HomePage {

  genero: any;
  detalhePage = DetalhePage;
  filme: Filme;

  generoList = [
    { nome: "Todos", id: 0 },
    { nome: "Comédia", id: 1 },
    { nome: "Família", id: 2 },
    { nome: "Românce", id: 3 },
    { nome: "Suspense", id: 4 },
    { nome: "Terror", id: 5 }
  ];

  playlists : Playlist[] = [];
  playlistItems : PlaylistItem[];


  constructor(public navCtrl: NavController,
    private alertCtrl: AlertController,
    private platform: Platform,
    private youtubeService: YoutubeService) { }



    // TESTES - recuperando playlists do canal
  ionViewWillEnter() {
    this.youtubeService.fetchPlaylists()
    .subscribe(
      (playlists) => {
        this.playlists = playlists;
        // Recuperando todos os filmes da playlist
        this.playlists.forEach(playlist => {
          this.youtubeService.getPlaylistItems(playlist.id)
            .subscribe(playlistItems => this.playlistItems = playlistItems);
        });
      },
      error => {
        console.log(error.json());
      }
    );
  }

  onGoToDetalhe() {
    this.navCtrl.push(DetalhePage);
  }

  onFind(form){

  }

  setFilme(){

    let randomMovie = this.playlistItems[Math.floor(Math.random() * this.playlistItems.length)];

    this.filme = new Filme();
    this.filme.Descricao = randomMovie.description;
    this.filme.Imagem = randomMovie.thumbnails.high;
    this.filme.DataPublicacao = new Date(randomMovie.publishedAt);
  }

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
