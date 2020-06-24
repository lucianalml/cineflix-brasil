import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

/**
 * Generated class for the YoutubePipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'youtube',
})
export class YoutubePipe implements PipeTransform {

  constructor(private dom: DomSanitizer){

  }
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: string) {
    // return value.toLowerCase();
    return this.dom.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/'+value);
  }
}
