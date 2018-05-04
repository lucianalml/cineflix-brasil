import { Component } from '@angular/core';
import { NgForm } from "@angular/forms";

import { NavController, AlertController, Platform, LoadingController } from 'ionic-angular';

import { DetalhePage } from '../detalhe/detalhe';

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

  pesquisado: boolean = false;
  loading = this.loadingCtrl.create();

  frasesLoader = [
    'Prepare sua pipoca',
    'Luz, câmera, ação!',
    'Chame a galera!',
    'O filme vai começar',
    'Estamos escolhendo um filme para você',
  ]

  playlists: Playlist[];
  randomItem : PlaylistItem;

  constructor(public navCtrl: NavController,
    private alertCtrl: AlertController,
    private platform: Platform,
    private youtubeService: YoutubeService,
    public loadingCtrl: LoadingController) { }


  ionViewWillEnter() {

    // Recupera playlists do canal
    this.youtubeService.fetchPlaylistsFromChannel().subscribe((playlists) => {

        this.playlists = playlists;

        // Cria lista com gêneros recuperando os títulos das playlists
        this.generoList = [{ id: 'TODOS', nome: "Todos" }];
        for (let i = 0; i < this.playlists.length; i++) {
          this.generoList.push({id: this.playlists[i].id,
                                nome: this.playlists[i].title  ? this.playlists[i].title : "Sem titilo" });
        }
      },
      error => {
        console.log(error.json());
      }
    );
  }

  onRandomButton(form: NgForm){

    this.pesquisado = true;

    if (!this.playlists) {
      return;
    }

    let playlistId = this.generoSelected;

    // Fazer a busca em todas as playlists
    if (this.generoSelected == 'TODOS') {

      // Recupera uma playlist aleatória entre todas
      playlistId = this.playlists[Math.floor(Math.random() * this.playlists.length)].id;
    }

    this.randomItem = null;

    this.recuperarFilme(playlistId);

  }

  // Página de detalhe
  onGoToDetalhe() {
    this.navCtrl.push(DetalhePage, { item: this.randomItem } );
  }

  recuperarFilme(playlistId) {

    this.showLoading();

    // Recupera um video aleatório na playlist selecionada
    this.youtubeService.getPlaylistItems(playlistId)
      .subscribe(playlistItems => {

        playlistItems = playlistItems.filter(item => item !== null);

        this.randomItem = playlistItems[Math.floor(Math.random() * playlistItems.length)];

        this.hideLoading();
      });
  }

  showLoading() {

     let loaderContent = this.frasesLoader[Math.floor(Math.random() * this.frasesLoader.length)];

    this.loading = this.loadingCtrl.create({
      content: loaderContent
    });
    this.loading.present();
  }

  hideLoading(){
    this.waitSeconds(3000);
    this.loading.dismiss();
  }

  waitSeconds(iMilliSeconds) {
    var counter= 0
        , start = new Date().getTime()
        , end = 0;
    while (counter < iMilliSeconds) {
        end = new Date().getTime();
        counter = end - start;
    }
}
}
