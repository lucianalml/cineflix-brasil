import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";

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

  detalhePage = DetalhePage;
  filme: Filme;

  generoSelected = 'TODOS';
  generoList = [{ id: 'TODOS', nome: "Todos" }];

  playlists : Playlist[] = [];
  playlistItems : PlaylistItem[] = [];

  constructor(public navCtrl: NavController,
    private alertCtrl: AlertController,
    private platform: Platform,
    private youtubeService: YoutubeService) { }


  ionViewWillEnter() {

// Recupera playlists do canal
    this.youtubeService.fetchPlaylists().subscribe((playlists) => {

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

  onAssistirFilme(form: NgForm){

    // Fazer a busca em todas as playlists
    if (this.generoSelected == 'TODOS') {

      // Recupera uma playlist aleatória
      let randomPlaylist = this.playlists[Math.floor(Math.random() * this.playlists.length)];

      // Recupera um video aleatório
      this.youtubeService.getPlaylistItems(randomPlaylist.id)
      .subscribe(playlistItems => {
        this.playlistItems = playlistItems;

        let randomMovie = this.playlistItems[Math.floor(Math.random() * this.playlistItems.length)];

        this.filme = new Filme();
        this.filme.Nome = randomMovie.title;
        this.filme.Descricao = randomMovie.description;
        this.filme.Imagem = randomMovie.thumbnails.high;
        this.filme.DataPublicacao = new Date(randomMovie.publishedAt);
      });

    } else {
      // Recupera um video aleatório na playlist selecionada
          this.youtubeService.getPlaylistItems(this.generoSelected)
            .subscribe(playlistItems => {
              this.playlistItems = playlistItems;

              let randomMovie = this.playlistItems[Math.floor(Math.random() * this.playlistItems.length)];

              this.filme = new Filme();
              this.filme.Nome = randomMovie.title;
              this.filme.Descricao = randomMovie.description;
              this.filme.Imagem = randomMovie.thumbnails.high;
              this.filme.DataPublicacao = new Date(randomMovie.publishedAt);
            });
    }
  }

  // Página de detalhe
  onGoToDetalhe() {
    this.navCtrl.push(DetalhePage);
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
