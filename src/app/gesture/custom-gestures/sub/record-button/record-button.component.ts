import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { GetIsWatchingResult, VolumeButtons, VolumeButtonsOptions, VolumeButtonsResult } from '@capacitor-community/volume-buttons';
import { CircularProgressComponent } from '../../../../dependencies/circular-progress/circular-progress.component';
import { RuntimeService } from '../../../../services/runtime.service';
import { ButtonGesture, ButtonRecord } from '../../../../dependencies/components';
import { UserService } from '../../../../services/user.service';
import { Capacitor } from '@capacitor/core';
import { Dialog } from '@capacitor/dialog';
import { GestureRecognitionService } from '../../../../services/gesture-recognition.service';

@Component({
  selector: 'app-record-button',
  imports: [CommonModule, CircularProgressComponent],
  templateUrl: './record-button.component.html',
  styleUrl: './record-button.component.css'
})
export class RecordButtonComponent implements OnDestroy {

  lastInputTime = 0;
  data: ButtonGesture;

  recordedData: ButtonRecord[] = [];
  totalTimes = 0;



  constructor(public runtime: RuntimeService, private user: UserService, private gService: GestureRecognitionService) {
    this.data = {
      id: gService.allGestures.length + 1,
      gType: 2,
      name: gService.recordingGesture.metadata.name,
      recordTrials: []
    }

    if(Capacitor.getPlatform() === 'web') {
      Dialog.alert({
        title: 'Web Platform',
        message: 'Volume button gestures are not supported on the web platform. Please use a mobile device.',
      });
      return;
    }



    if(this.gService.recordingGesture.metadata.gestureType !== 2 || !this.gService.recordingGesture.metadata.name.length) {
      {
        gService.recordingGesture.metadata = {
          name: 'bip..bip',
          gestureType: 2,
          rythmic: true
        }
      }
      // re-route to create gesture
      // throw new Error('Invalid gesture type or name not set');
    }
    this.gService.recordingGesture.state = true;
    this.gService.recordingGesture.metadata.gestureType = 2; // Volume Button gesture type

    gService.recordingGestureCB = this.RecordGesture.bind(this);
  }

  RecordGesture(type:number, err:any, res:VolumeButtonsResult) {
    if(type!==2) return;
    if(err){
      console.error('Error watching volume buttons:', err);
      return;
    }

    let timeDFF = this.recordedData.length?Date.now() - this.lastInputTime:0; // time difference from last

    if(this.data.recordTrials.length) {

      // current recorded geture pattern is longer than fiirst of the same gesture
      if(this.data.recordTrials[0].length <= this.recordedData.length) {
        this.recordedData = [];
        Dialog.alert({
          title: 'Gesture mismatch',
          message: 'The Gesture patterns do not align with the first one. Please try again.',
        })
        return;
      }

      // make sure the recorded data is not much different from the first
      if(this.data.recordTrials[0][this.recordedData.length].button !== res.direction || Math.floor(this.data.recordTrials[0][this.recordedData.length].timeDiff/1000) !== Math.floor(timeDFF/1000)) {
        this.recordedData = [];
        Dialog.alert({
          title: 'Gesture mismatch',
          message: 'The Gesture patterns do not align with the first one. Please try again.',
        })
        return;
      }
    }

    this.recordedData.push({
      button: res.direction,
      duration: 0,
      timeDiff: timeDFF
    })

    this.lastInputTime = Date.now();
  }


  get TimeNow(){
    // console.log('TimeNow');
    if(this.lastInputTime<=0 || Date.now()<this.lastInputTime ) return 0;
    let ratio = (Date.now() - this.lastInputTime)/this.gService.recordTimeOut;
    if( ratio >= 1) {
      ratio = 1;
      this.lastInputTime = 0;
      this.totalTimes++;
      this.data.recordTrials.push(this.recordedData); // train
      this.recordedData = [];
      // end recording
    }

    if(this.totalTimes==this.gService.maxRecordTimes || this.data.recordTrials.length==this.gService.maxRecordTimes) {
      this.gService.addButtonGesture(this.data);
      this.gService.save();
      this.endRecording();
      history.back();
    }
    return Number( (ratio * 75).toFixed(2) );
  }

  endRecording(){
    this.gService.recordingGestureCB = ()=>{};
    this.gService.recordingGesture.state = false;
  }
  ngOnDestroy(): void {
    this.endRecording()
    this.gService.recordingGesture.metadata.gestureType = 0;
    this.gService.recordingGesture.metadata.name = '';
  }
}
