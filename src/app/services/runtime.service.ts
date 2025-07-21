import { Injectable } from '@angular/core';
import { ButtonGesture, ShakePhonesGesture, SpeechGesture, SysGestures, TouchGesture } from '../dependencies/components';
import EventBus from '../dependencies/Eventbus';

import { Capacitor } from '@capacitor/core';

@Injectable({
  providedIn: 'root'
})
export class RuntimeService {

  eventbus: EventBus = new EventBus();

  pageData: {title: string, back: boolean, right?:Array<{name: string, class: string, cb:Function}>} = {title: 'Home', back: false}
  platform = Capacitor.getPlatform();
  constructor() {
  }


}
