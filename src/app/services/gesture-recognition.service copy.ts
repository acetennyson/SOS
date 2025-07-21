import { Injectable } from '@angular/core';
import { ButtonGesture, ButtonRecord, ShakePhonesGesture, SpeechGesture, TouchRecord, TouchGesture, SpeechRecord, SysGestures } from '../dependencies/components';
import { Directory, Encoding, Filesystem } from '@capacitor/filesystem';
import EventBus from '../dependencies/Eventbus';
import { Capacitor } from '@capacitor/core';
import { VolumeButtons } from '@capacitor-community/volume-buttons';
import { Motion } from '@capacitor/motion';

@Injectable({
  providedIn: 'root'
})
export class  {

  // we're not using any AI API here, pure logical Narrow AI
  // this service is for recognizing custom gestures based on motion data
  // and storing them in a record for later use
  // this service will be used by the RecordComponent to record custom gestures

  Encoding: Encoding.UTF8|Encoding.UTF16;
  loaded = false;
  eventbus = new EventBus()

  recordTimeOut = 5000;
  maxRecordTimes = 3;
  listening = {
    volume: false,
    screen: false,
    audio: false,
    motion: false
  }
  recordingGesture: {state: boolean, metadata: {gestureType: number, name: string, rythmic: boolean}, data?: ButtonGesture|TouchGesture|SpeechGesture|ShakePhonesGesture, lastInputTime: number} = {
    state: false,
    metadata: {
      gestureType: 0,
      name: '',
      rythmic: false
    },
    lastInputTime: 0

  };

  recordingGestureCB: (type:number, ...data:any[])=>void = ()=>{}

  /**
   * @description 1 shake, 2 volume, 3 touch, 4 speech
   */
  sysGestures: SysGestures[] = [
    {
      id: 1,
      name: 'Shake Phone',
      description: 'Shake your phone to trigger this gesture.',
      fontAwesomeIcon: 'text-lg fa fa-mobile',
      enabled: false
    },
    {
      id: 2,
      name: 'Volume Button',
      description: 'Use volume buttons to trigger this gesture.',
      fontAwesomeIcon: 'text-lg fa fa-volume-up',
      enabled: false
    },
    {
      id: 3,
      name: 'Touch Gesture',
      description: 'Draw a gesture on the screen to trigger this action.',
      fontAwesomeIcon: 'text-lg fa fa-hand-pointer', // fa-hand-paper
      enabled: false
    },
    {
      id: 4,
      name: 'Speech Command',
      description: 'Use voice commands to trigger this gesture.',
      fontAwesomeIcon: 'text-lg fa fa-microphone',
      enabled: false
    }
  ];

  constructor() {
    this.load()
    this.eventbus.subscribe('loaded', ()=>{
      this.loaded = true;
      console.log(this.allGestures);
      this.turnOnListeners();
    })
    this.eventbus.subscribe('save', this.save.bind(this))
    this.Encoding = Capacitor.getPlatform() === 'android' ? Encoding.UTF16:Encoding.UTF8
  }

  buttonGestures: ButtonGesture[] = [];
  speechGestures: SpeechGesture[] = [];
  touchGestures: TouchGesture[] = [];
  shakeGestures: ShakePhonesGesture[] = [];

  allGestures: Array<ButtonGesture | TouchGesture | SpeechGesture | ShakePhonesGesture> = [];

  addButtonGesture(gesture: ButtonGesture): void {
    this.buttonGestures.push(gesture);
    this.allGestures.push(gesture);
  }
  addSpeechGesture(gesture: SpeechGesture): void {
    this.speechGestures.push(gesture);
    this.allGestures.push(gesture);
  }
  addShakeGesture(gesture: ShakePhonesGesture): void {
    this.shakeGestures.push(gesture);
    this.allGestures.push(gesture);
  }
  getAllGestures(): Array<ButtonGesture | TouchGesture | SpeechGesture | ShakePhonesGesture> {
    return this.allGestures;
  }

  buttonRecordRecognition(record: ButtonRecord[]) {

    for (let i = 0; i < this.buttonGestures.length; i++) {
      const gesture = this.buttonGestures[i];

      if (gesture.recordTrials.length) {
        // gesture.recordTrials contains an array of 3 button record arrays having same button type with almost the same duration and timeDiff

        /*
        // make sure each button record array has the same length
        // this is not necessary, but can be used to ensure consistency
          let length = gesture.recordTrials[0].length;
          gesture.recordTrials.forEach(recorrd => {
            if (recorrd.length !== length) {
              throw new Error('Button record arrays must have the same length');
            }
          });
        */

        // check if passed button record length matches with one of the gesture trial records
        if (record.length !== gesture.recordTrials[0].length) {
          return null;
        }

        // get the max duration and timeDiff from all button record arrays and compare with the record to be recognized
        let maxDuration = 0;
        let maxTimeDiff = 0;
        let minDiffTime = 5000; // minimum time difference to consider a gesture valid
        let minDuration = 5000; // minimum duration to consider a gesture valid
        let matchingGesture = true;
        gesture.recordTrials.forEach((recorrd, index) => {
          if(!recorrd.length) {
            // empty record
            matchingGesture = false;
            return
          }

          // Math.floor(this.data.recordTrials[0][this.recordedData.length].timeDiff/1000) !== Math.floor(timeDFF/1000)

          maxDuration = (recorrd[0].duration > maxDuration)?recorrd[0].duration:maxDuration;
          maxTimeDiff = (recorrd[0].timeDiff > maxTimeDiff)?recorrd[0].timeDiff: maxTimeDiff;
          minDiffTime = (recorrd[0].timeDiff < minDiffTime)?recorrd[0].timeDiff:minDiffTime;
          minDuration = (recorrd[0].duration < minDuration)?recorrd[0].duration:minDuration;

          if(recorrd[index].button !== record[index].button || record[index].duration > maxDuration || record[index].timeDiff > maxTimeDiff || record[index].timeDiff < minDiffTime || record[index].duration < minDuration) {
            matchingGesture = false;
            return
          }

        });

        if(matchingGesture) {
          return gesture;
        }

      }

    }

    return null;

  }

  trainButtonGesture(gesture: ButtonGesture, record: ButtonRecord[]) {
    gesture.recordTrials.push(record);
  }

  touchRecordRecognition(record: TouchRecord[]) {
    for (let i = 0; i < this.touchGestures.length; i++) {
      const gesture = this.touchGestures[i];

      if (gesture.recordTrials.length) {

        if (record.length !== gesture.recordTrials[0].length) {
          return null;
        }

        let touchRadius = 20;
        let maxDuration = 0;
        let maxTimeDiff = 0;
        let minDiffTime = 5000; // minimum time difference to consider a gesture valid
        let minDuration = 5000; // minimum duration to consider a gesture valid
        let matchingGesture = true;
        gesture.recordTrials.forEach((recorrd, index) => {
          if(!recorrd.length) {
            // empty record
            matchingGesture = false;
            return
          }
          maxDuration = (recorrd[0].duration > maxDuration)?recorrd[0].duration:maxDuration;
          maxTimeDiff = (recorrd[0].timeDiff > maxTimeDiff)?recorrd[0].timeDiff: maxTimeDiff;
          minDiffTime = (recorrd[0].timeDiff < minDiffTime)?recorrd[0].timeDiff:minDiffTime;
          minDuration = (recorrd[0].duration < minDuration)?recorrd[0].duration:minDuration;

          // check if the touch is within the gesture radius
          if(Math.sqrt(Math.pow(record[index].x - recorrd[index].x, 2) + Math.pow(record[index].y - recorrd[index].y, 2)) > touchRadius) {
            matchingGesture = false;
            return
          }

          if(recorrd[index].duration !== record[index].duration || record[index].timeDiff > maxTimeDiff || record[index].timeDiff < minDiffTime || record[index].duration < minDuration) {
            matchingGesture = false;
            return
          }

        });

        if(matchingGesture) {
          return gesture;
        }

      }

    }

    return null;
  }

  speechRecordRecognition(record: SpeechRecord) {
    for (let i = 0; i < this.speechGestures.length; i++) {
      const gesture = this.speechGestures[i];

      if (gesture.recordTrials.text == record.text) {
        return gesture;
      }

    }

    return null;
  }



  turnOnVolumeListeners(){
    // volume
    VolumeButtons.isWatching()
    .then(iswatch=>{
      if(iswatch.value){
        this.sysGestures.find(sys=>sys.id==2)?.enabled==true;
      }else{
        let sysGV = this.sysGestures.find(sys=>sys.id==2);
        if(!sysGV) return;

        sysGV.enabled=true;
        VolumeButtons.watchVolume({
          suppressVolumeIndicator: true,
          disableSystemVolumeHandler: true
        }, (res, err)=>{
          if(this.recordingGesture.state) {
            this.recordingGestureCB( 2, err, res)
            return
          }

          if(err) {
            console.error('volumeWatchError', err)
            return;
          }

          // read ac

        }).catch(err=>{
          sysGV.enabled = false;
        })
      }
    })
  }

  turnOnShakeListeners() {
    // check permision
    let sysGV = this.sysGestures.find(sys=>sys.id==1);
    if(!sysGV){
      return
    }

    if(Capacitor.getPlatform()!=='web'){
      sysGV.enabled = true
    }

    Motion.addListener('accel', (event)=>{
      sysGV.enabled = true

      if(this.listening.motion && this.recordingGesture.state) {
        this.recordingGestureCB(1, null, event);
        return
      }
    })
    .catch(err=>{
      sysGV.enabled = false
      this.recordingGestureCB(1, err, null);
    })
  }

  turnOnListeners(){
    this.turnOnVolumeListeners()
    this.turnOnShakeListeners()
  }



  save() {
    if(!this.loaded) return
    Filesystem.writeFile({
      data: JSON.stringify(this.allGestures),
      directory: Directory.Data,
      path: 'gestures',
      encoding: this.Encoding
    })
  }


  load() {
    Filesystem.readdir({
      path: '',
      directory: Directory.Data
    })
    .then(
      (dir)=>{
        let file = dir.files.find(f=>f.name=='gestures');
        if(!file){
          this.eventbus.dispatch('loaded', true)
          this.save();
          return;
        }

        Filesystem.readFile({
          directory: Directory.Data,
          path: 'gestures',
          encoding: this.Encoding
        })
        .then(
          (files)=>{
            this.allGestures = JSON.parse(files.data as string);
            this.eventbus.dispatch('loaded', true)
          }
        )
        .catch(err=>{
          // unable to read saved data
          // i dont have time to continue on this possibility
          console.error('error during readFile in gestureRecognitionService', err);
          Filesystem.deleteFile({
            directory: Directory.Data,
            path: 'gestures'
          }).then(
            (data)=>{
              this.loaded = true
              this.save();
            }
          )
        })

      }
    )
  }

}
