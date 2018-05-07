import { Component } from '@angular/core';
import { NgForm } from "@angular/forms";

import { NavController, AlertController, Platform, LoadingController } from 'ionic-angular';
import { Network } from '@ionic-native/network';

import { Observable } from "rxjs/Rx";

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
  // playlists$: Observable<Playlist[]>;

  randomItem : PlaylistItem;

  constructor(public navCtrl: NavController,
    private alertCtrl: AlertController,
    private platform: Platform,
    private network: Network,
    private youtubeService: YoutubeService,
    public loadingCtrl: LoadingController) { }


  ionViewWillEnter() {
    this.fetchPlaylists();

    // watch network for a disconnect
    let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      this.clearData();
    });

    // stop disconnect watch
    // disconnectSubscription.unsubscribe();

    // watch network for a connection
    let connectSubscription = this.network.onConnect().subscribe(() => {
      this.fetchPlaylists();
    });

    // stop connect watch
    // connectSubscription.unsubscribe();
  }

  fetchPlaylists() {

    // Recupera playlists do canal
    this.youtubeService.fetchPlaylistsFromChannel()
      // .do(console.log)
      .subscribe((playlists) => {
        this.setData(playlists);
      },
      error => {
        this.clearData();
        let alert = this.alertCtrl.create({
          title: 'Erro',
          subTitle: 'Não foi possível buscar os filmes. Verifique sua internet e tente novamente.',
          buttons: ['OK']
        });
        alert.present();
      }
    );
  }

  setData(playlists: Playlist[]) {
    this.playlists = playlists;
    // Cria lista com gêneros recuperando os títulos das playlists
    this.generoList = [{ id: 'TODOS', nome: "Todos" }];
    for (let i = 0; i < playlists.length; i++) {
      this.generoList.push({id: playlists[i].id,
                            nome: playlists[i].title  ? playlists[i].title : "Sem titilo" });
    }

  }

  clearData(){
    this.playlists = null;
    this.generoList = [{ id: 'TODOS', nome: "Todos" }];
    this.randomItem = null;
  }

  onRandomButton(form: NgForm){

    this.randomItem = null;

    if (!this.playlists) {
      this.fetchPlaylists();
      return;
    }
    this.pesquisado = true;
    this.showLoading();
    this.getRandomMovie();
  }

  getRandomMovie() {

    // Se selecionou um gênero
    let playlistId = this.generoSelected;

    // Se selecionou todos os gêneros recupera filmes de uma playlist aleatória
    if (this.generoSelected == 'TODOS') {
      playlistId = this.playlists[Math.floor(Math.random() * this.playlists.length)].id;
    }

    // TESTES
    // var playlistSelected = this.playlists.filter(function(item) {
    //   return item.id === playlistId;
    // })[0];
    // console.log('Playlist sorteada: ' + playlistSelected.title);

    // Recupera um video aleatório na playlist selecionada
    this.youtubeService.getPlaylistItems(playlistId)
      .first()
      // .filter(item => item !== null) //nao deu certo
      // .do(console.log)
      .subscribe(playlistItems => {

        playlistItems = playlistItems.filter(item => item !== null);

        this.randomItem = playlistItems[Math.floor(Math.random() * playlistItems.length)];

        // Se a playlist esta vazia
        if (this.randomItem) {
          this.hideLoading();
        } else {
          this.getRandomMovie();
        }

      }),
      error => {
        this.hideLoading();
        let alert = this.alertCtrl.create({
          title: 'Erro',
          subTitle: 'Erro ao buscar filme.',
          buttons: ['OK']
        });
        alert.present();
      };
  }

  // Página de detalhe
  onGoToDetalhe() {
    this.navCtrl.push(DetalhePage, { item: this.randomItem } );
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
