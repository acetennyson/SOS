import { Injectable } from '@angular/core';
import { ButtonGesture, ButtonRecord, ShakePhoneRecord, ShakePhonesGesture, SpeechGesture, TouchRecord, TouchGesture, SpeechRecord, SysGestures, CustomAction } from '../dependencies/components';
import { Directory, Encoding, Filesystem } from '@capacitor/filesystem';
import EventBus from '../dependencies/Eventbus';
import { Capacitor } from '@capacitor/core';
import { VolumeButtons } from '@capacitor-community/volume-buttons';
import { Motion } from '@capacitor/motion';
import { Dialog } from '@capacitor/dialog';

@Injectable({
  providedIn: 'root'
})
export class GestureRecognitionService {

  // we're not using any AI API here, pure logical Narrow AI
  // this service is for recognizing custom gestures based on motion data
  // and storing them in a record for later use
  // this service will be used by the RecordComponent to record custom gestures

  Encoding: Encoding.UTF8|Encoding.UTF16;
  loaded = false;
  eventbus = new EventBus()
  buttonGestures: ButtonGesture[] = [];
  speechGestures: SpeechGesture[] = [];
  touchGestures: TouchGesture[] = [];
  shakeGestures: ShakePhonesGesture[] = [];

  allGestures: Array<ButtonGesture | TouchGesture | SpeechGesture | ShakePhonesGesture> = [];

  recordTimeOut = 2500;
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

  recordedData: {
    'button': ButtonRecord[],
    [index:string]: ButtonRecord[]|SpeechRecord[]|ShakePhoneRecord[]|TouchRecord[]
  } = {
    'button': []
  };

  lastInputTime:{'button':number, [index:string]: number} = {
    button: 0
  };

  timeOutVar:{'button':any, [index:string]: any} = {
    button: null
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
      console.log('gestures', this.allGestures);
      this.shakeGestures = this.allGestures.filter(g=>g.gType==1)
      this.buttonGestures = this.allGestures.filter(g=>g.gType==2)
      this.turnOnListeners();
    })
    this.eventbus.subscribe('save', this.save.bind(this))
    this.Encoding = Capacitor.getPlatform() === 'android' ? Encoding.UTF16:Encoding.UTF8
  }

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

    // the first gesture recordtrial is enough to give, no need comparing with all 3 trials
    const getMatchingLength = this.buttonGestures.filter(bgs => (bgs.recordTrials.length && bgs.recordTrials[0].length==record.length) );
    if(!getMatchingLength) return null;

    for (let i = 0; i < getMatchingLength.length; i++) {
      const gesture = getMatchingLength[i];
      const firstRecord = gesture.recordTrials[0];

      // better than the previous one, right????
      let falseMatch = record.find((data, index)=>{
        return firstRecord[index].button!==data.button || Math.floor(firstRecord[index].timeDiff/(1000)) !== Math.floor(data.timeDiff/(1000))
      })

      if(!falseMatch) {
        return gesture;
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



  UpdateTimeOut(params:{name: 'button'|'shake'|'speech'|'touch'}) {
    this.lastInputTime[params.name] = Date.now()
    if(this.timeOutVar[params.name]) {
      clearTimeout(this.timeOutVar[params.name]);
      this.timeOutVar[params.name] = null;
      delete this.timeOutVar[params.name]
    }

    this.timeOutVar[params.name] = setTimeout(() => {
      let record = this.recordedData[params.name];
      this.lastInputTime[params.name] = 0;
      this.recordedData[params.name] = [];
      let gest = this.Detect(record, params.name);
      this.eventbus.dispatch('performAction', gest?.id);
    }, this.recordTimeOut);
  }

  Detect(record: ButtonRecord[]|SpeechRecord[]|ShakePhoneRecord[]|TouchRecord[], type:'button'|'shake'|'speech'|'touch'){
    switch (type) {
      case 'button':
        // ensure record is ButtonRecord[]
        if (!Array.isArray(record) || !record.every(item => 'button' in item && 'duration' in item && 'timeDiff' in item)) {
          // throw new Error('Invalid record format. Expected an array of ButtonRecord objects.');
          return null
        }
        return this.buttonRecordRecognition(record)
      break;

      default:
        return null
        break;
    }
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
          let timeDFF = 0;
          if(this.recordingGesture.state) {
            this.recordingGestureCB( 2, err, res)
            return
          }

          if(err) {
            console.error('volumeWatchError', err)
            return;
          }

          if(this.lastInputTime.button==0){
            this.recordedData.button = [];
          }else{
            timeDFF = Date.now() - this.lastInputTime.button;
          }

          this.recordedData.button.push({
            button: res.direction,
            duration: 0,
            timeDiff: timeDFF
          });

          this.UpdateTimeOut({name:'button'});

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
    try {
      // new Worker()
      this.turnOnVolumeListeners()
      this.turnOnShakeListeners()
    } catch (error) {
      Dialog.alert({title: 'Device Sensor Error', message: (error as string)});
    }
  }



  save() {
    if(!this.loaded) return
    Filesystem.writeFile({
      data: JSON.stringify({gestures: this.allGestures, recordTimeOut:this.recordTimeOut}),
      directory: Directory.Data,
      path: 'gestures',
      encoding: this.Encoding
    }).then(()=>{
      this.eventbus.dispatch('save', this.allGestures)
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
          this.eventbus.dispatch('loaded', this.allGestures)
          this.save();
          return;
        }

        Filesystem.readFile({
          directory: Directory.Data,
          path: 'gestures',
          encoding: this.Encoding
        })
        .then(
          (file)=>{
            if(file.data) {
              console.log('gesture file data', file.data);
              let alldata = JSON.parse(file.data as string)
              this.allGestures = alldata.gestures || [];
              this.recordTimeOut = alldata.recordTimeOut || this.recordTimeOut;
              this.eventbus.dispatch('loaded', this.allGestures)
            }
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
              this.eventbus.dispatch('loaded', this.allGestures)
              this.save();
            }
          )
        })

      }
    )
  }

}
