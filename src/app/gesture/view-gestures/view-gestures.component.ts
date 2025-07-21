import { Component } from '@angular/core';
import { RuntimeService } from '../../services/runtime.service';
import { ButtonGesture, ShakePhonesGesture, SpeechGesture, TouchGesture } from '../../dependencies/components';
import { GestureRecognitionService } from '../../services/gesture-recognition.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActionService } from '../../services/action.service';
import { RouterLink } from '@angular/router';
import { WebService } from '../../services/web.service';
import { RouterService } from '../../services/router.service';

@Component({
  selector: 'app-view-gestures',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './view-gestures.component.html',
  styleUrl: './view-gestures.component.css'
})
export class ViewGesturesComponent {

  shakeG: ShakePhonesGesture[] = [];
  buttonG:ButtonGesture[] = [];
  touchG: TouchGesture[] = [];
  speechG: SpeechGesture[] = [];

  constructor( private runtime: RuntimeService, private gService: GestureRecognitionService, private gAction: ActionService, private router: RouterService) {

    gService.sysGestures;

    this.shakeG = this.gService.allGestures.filter(g=>g.gType==1);
    this.buttonG = gService.allGestures.filter(g=>g.gType==2);
    this.touchG = gService.allGestures.filter(g=>g.gType==3);
    this.speechG = gService.allGestures.filter(g=>g.gType==4);
  }

  isEnabled(gestureId:number){
    let action = this.gAction.actions.find(a=>a.id==gestureId);
    return action
  }

  gestureClick(gestureId:number){
    let action = this.gAction.actions.find(a=>a.id==gestureId);
    if(action) {
      // has action, decide to change or remove
    }
    // has no action, add new action
  }

  toggleAction(gestureId:number){
    let Ev = (event?.target as HTMLInputElement || {value: false}).value;
    let action = this.gAction.actions.find(a=>a.id==gestureId);
    if(action) {
      // has action, decide to change or remove
      action.enabled = Boolean(Ev)
      this.gAction.save()?.then(
        ()=>{
          this.router.reload()
        }
      )
      return
    }
    this.router.reload();
    // has no action, add new action
  }
}
