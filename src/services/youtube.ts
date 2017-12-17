import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import 'rxjs/Rx';

import { Filme } from "../models/filme";

@Injectable()
export class YoutubeService {
  private filme: Filme;

  constructor(private http: Http) {}

  getFilme() {
    return this.filme;
  }

  fetchList() {

    // return this.http.get('https://ionic2-recipebook.firebaseio.com/' + userId + '/recipes.json?auth=' + token)
    //   .map((response: Response) => {
    //     const recipes: Recipe[] = response.json() ? response.json() : [];
    //     for (let item of recipes) {
    //       if (!item.hasOwnProperty('ingredients')) {
    //         item.ingredients = [];
    //       }
    //     }
    //     return recipes;
    //   })
    //   .do((recipes: Recipe[]) => {
    //     if (recipes) {
    //       this.recipes = recipes;
    //     } else {
    //       this.recipes = [];
    //     }
    //   });
    }
}
