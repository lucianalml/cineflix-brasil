import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetalhePage } from './detalhe';

import { YoutubePipe } from '../../pipes/youtube/youtube';

@NgModule({
  declarations: [
    YoutubePipe,
    DetalhePage,
  ],
  imports: [
    IonicPageModule.forChild(DetalhePage),
  ],
})
export class DetalhePageModule {}
