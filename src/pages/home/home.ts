import { Component } from '@angular/core';
import { NgForm } from "@angular/forms";

import { NavController, AlertController, Platform } from 'ionic-angular';
import { Network } from '@ionic-native/network';

import { DetalhePage } from '../detalhe/detalhe';

import { Playlist } from './../../models/playlist';
import { PlaylistItem } from '../../models/playlistItem';

import { YoutubeService } from '../../services/youtube';
import { Subscription } from 'rxjs';

@Component({
  selector: "page-home",
  templateUrl: "home.html"
})
export class HomePage {

  connectSubscription: Subscription;
  disconnectSubscription: Subscription;

  detalhePage = DetalhePage;

  generoSelected = 'TODOS';
  generoList = [{ id: 'TODOS', nome: "Todos" }];

  pesquisado: boolean = false;
  // loading = this.loadingCtrl.create();

  frasesLoader = [
    'Prepare sua pipoca',
    'Luz, câmera, ação!',
    'Chame a galera!',
    'O filme vai começar',
    'Estamos escolhendo um filme para você',
  ];
  roletaVoltaList = [
    "roulette-360",
    "roulette-390",
    "roulette-420",
    "roulette-450",
    "roulette-480",
    "roulette-510",
    "roulette-540",
    "roulette-570",
    "roulette-600",
    "roulette-630",
    "roulette-660",
    "roulette-690"
  ];
  roletaVolta: string;
  comparar: string;
  loaderContent: string;
  onLoader: boolean = false;

  playlists: Playlist[];
  randomItem : PlaylistItem;

  requestCounter: number;

  constructor(public navCtrl: NavController,
    private alertCtrl: AlertController,
    private platform: Platform,
    private network: Network,
    private youtubeService: YoutubeService) { }


  ionViewWillEnter() {

    this.fetchPlaylists();

    // watch network for a disconnect
    this.disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      this.clearData();
    });

    // watch network for a connection
    this.connectSubscription = this.network.onConnect().subscribe(() => {
      this.fetchPlaylists();
    });
  }

  ionViewWillLeave() {
    this.disconnectSubscription.unsubscribe();
    this.connectSubscription.unsubscribe();
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
        this.showAlert('Erro',
          'Não foi possível buscar os filmes. Verifique sua internet e tente novamente.');
      }
    );
  }

  showAlert(title: string, subtitle: string) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subtitle,
      buttons: ['OK']
    });
    alert.present();
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
    this.requestCounter = 0;

    if (!this.playlists) {
      this.fetchPlaylists();
      return;
    }
    this.pesquisado = true;
    this.showLoading();
    this.getRandomMovie();
  }

  getRandomMovie() {

    this.requestCounter ++;

    if ( this.requestCounter > 5 ) {
      this.hideLoading();
      this.showAlert('Erro', 'Não foram encontrados filmes nessa categoria.');
      return;
    }

    // Se selecionou um gênero
    let playlistId = this.generoSelected;

    // Se selecionou todos os gêneros recupera filmes de uma playlist aleatória
    if (this.generoSelected == 'TODOS') {
      playlistId = this.playlists[Math.floor(Math.random() * this.playlists.length)].id;
    }

    // Recupera um video aleatório na playlist selecionada
    this.youtubeService.getPlaylistItems(playlistId)
      .first()
      .subscribe(playlistItems => {

        playlistItems = playlistItems.filter(item => item !== null);

        this.randomItem = playlistItems[Math.floor(Math.random() * playlistItems.length)];

        // Se encontrou algum filme
        if (this.randomItem) {
          this.hideLoading();
        // Se não encontrou filme nessa playlist busca novamente
        } else {
          this.getRandomMovie();
        }

      }),
      error => {
        this.hideLoading();
        this.showAlert('Erro', 'Erro ao buscar filme.');
      };
  }

  // Página de detalhe
  onGoToDetalhe() {
    this.navCtrl.push(DetalhePage, { item: this.randomItem } );
  }

  showLoading() {
    this.comparar = this.roletaVolta;
    this.roletaVolta = this.roletaVoltaList[Math.floor(Math.random() * this.roletaVoltaList.length)];
    this.loaderContent = this.frasesLoader[Math.floor(Math.random() * this.frasesLoader.length)];
    this.onLoader = true;
  }

  hideLoading(){
    this.waitSeconds(3000);
    this.onLoader = false;
  }

  waitSeconds(iMilliSeconds) {
    var counter = 0,
      start = new Date().getTime(),
      end = 0;

    while (counter < iMilliSeconds) {
      end = new Date().getTime();
      counter = end - start;
    }
  }
}
