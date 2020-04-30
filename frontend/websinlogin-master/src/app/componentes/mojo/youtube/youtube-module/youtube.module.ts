import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { YoutubeRoutingModule } from './youtube.routing.module';
import { YoutubeComponent } from '../youtube.component';
import { ComunModule } from '../../../../modulos/comun/comun.module';

@NgModule({
  declarations: [YoutubeComponent],
  imports: [
    CommonModule,
    ComunModule,
    YoutubeRoutingModule
  ]
})
export class YoutubeModule { }
