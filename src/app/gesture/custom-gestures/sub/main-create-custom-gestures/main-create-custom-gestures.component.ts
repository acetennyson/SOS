import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SysGestures } from './../../../../dependencies/components';
import { RuntimeService } from '../../../../services/runtime.service';
import { RouterService } from '../../../../services/router.service';
import { Dialog } from '@capacitor/dialog';
import { GestureRecognitionService } from '../../../../services/gesture-recognition.service';


@Component({
  selector: 'app-main-create-custom-gestures',
  imports: [FormsModule],
  templateUrl: './main-create-custom-gestures.component.html',
  styleUrl: './main-create-custom-gestures.component.css'
})
export class MainCreateCustomGesturesComponent {
  /* Example gesture types
  gestureTypes = [
    {
      id: 1,
      title: "Shake Phone",
      description: "Shake vigourously to trigger",
      class: "fa fa-mobile fs-1"
    },
    {
      id: 2,
      title: "Power Button",
      description: "press power button to trigger action",
      class: "fa fa-mobile fs-1"
    },
    {
      id: 3,
      title: "Volume +",
      description: "Press volume + to trigger",
      class: "fa fa-mobile fs-1"
    },
    {
      id: 4,
      title: "Volume -",
      description: "Press volume - to trigger",
      class: "fa fa-mobile fs-1"
    },
    {
      id: 5,
      title: "Screen Touch",
      description: "Draw or Touch Areas on screen",
      class: "fa fa-mobile fs-1"
    }
  ]
   */
  gestureTypes: SysGestures[];

  selectedBaseGesture: number = 0;
  rythmicDetection: boolean = false;
  gestureName: string = "";
  gestureDescription: string = "";

  constructor(public runtime: RuntimeService, private gService: GestureRecognitionService, private router: RouterService) {
    this.gestureTypes = this.gService.sysGestures.filter(g=>g.enabled);
  }

  RecordGesture() {
    if(!this.selectedBaseGesture) {
      console.warn('select a gesture type')
      return;
    }
    if(!this.gestureName.length) {
      // alert user to label gesture
      console.warn('gesture name required')
      return
    }

    let gestureType = this.gestureTypes.find(gt=>gt.id==this.selectedBaseGesture);
    this.gService.recordingGesture.metadata = {gestureType: this.selectedBaseGesture, name: this.gestureName, rythmic: this.rythmicDetection}
    // console.log("Start Recording", {gestureType, name: this.gestureName, rythmic: this.rythmicDetection});
    console.log('gesture type', this.selectedBaseGesture)
    switch (this.selectedBaseGesture) {
      case 1:
        this.router.goto('/app/gestures/create/record/motion')
      break;

      case 2:
        this.router.goto('/app/gestures/create/record/button')
      break;

      case 3:
        this.router.goto('/app/gestures/create/record/draw')
      break;

      default:
        Dialog.alert({
          title: 'Invalid Gesture Type',
          message: 'Select a valid gesture type'
        })
      break;
    }
  }
}
