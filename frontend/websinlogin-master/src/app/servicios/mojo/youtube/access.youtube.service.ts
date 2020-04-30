import { Injectable } from '@angular/core';
import { YoutubeService } from './youtube.service';

@Injectable({
  providedIn: 'root'
})
export class AccessYoutubeService {

  constructor(private _youtubeService:YoutubeService) { }
}
