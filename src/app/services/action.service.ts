import { SysAction } from './../dependencies/components';
import { Injectable } from '@angular/core';
import { App } from '@capacitor/app';
import { Geolocation, Position } from '@capacitor/geolocation';
import { AppLauncher } from '@capacitor/app-launcher';
import EventBus from '../dependencies/Eventbus';
import { CallInput, CustomAction, MessageInput } from '../dependencies/components';
import { Directory, Encoding, Filesystem } from '@capacitor/filesystem';
import { CapacitorFlash as Flash } from '@capgo/capacitor-flash';
import { CallNumber } from 'capacitor-call-number';
import { Capacitor } from '@capacitor/core';
import { Dialog } from '@capacitor/dialog';
import {SmsManager} from "@byteowls/capacitor-sms";
// import * as ca from 'cordova-plugin-call-number';

@Injectable({
  providedIn: 'root'
})
export class ActionService {

  eventbus = new EventBus();
  Encoding: Encoding.UTF8|Encoding.UTF16;
  actions: CustomAction[] = [];
  /**
   * @description 1 call, 2 sms, 3 flashlight, 4 send location, 5 record
   */
  SysAction: SysAction[] = [
    {
      type: 1,
      name: 'Call',
      description: 'Call a number',
      fontawesomeIcon: 'fa fa-phone',
      enabled: true
    },
    {
      type: 2,
      name: 'Message',
      description: 'Send a message',
      fontawesomeIcon: 'fa fa-comment',
      enabled: true
    },
    {
      type: 3,
      name: 'Flashlight',
      description: 'Toggle flashlight',
      fontawesomeIcon: 'fa fa-lightbulb',
      enabled: true
    },
    {
      type: 4,
      name: 'Location',
      description: 'Send your location',
      fontawesomeIcon: 'fa fa-location-arrow',
      enabled: false
    },
    {
      type: 5,
      name: 'Record',
      description: 'Silently start a video Record',
      fontawesomeIcon: 'fa fa-video',
      enabled: false
    }
  ];
  loaded = false

  constructor() {
    this.load();
    this.eventbus.subscribe('save', this.save.bind(this))
    this.eventbus.subscribe('loaded', (action)=>{
      this.loaded = true;
    })
    this.eventbus.subscribe('callnumber', this.callPhone.bind(this))
    this.Encoding = Capacitor.getPlatform() === 'android' ? Encoding.UTF16:Encoding.UTF8;
  }

  getLocation(cb?: (err:any, pos:any)=>void) {
    Geolocation.checkPermissions()
    .then(status => {
      if(status.location == 'granted')
        this.getPosition(cb)
      else
        // request permission
        Geolocation.requestPermissions()
        .then(status => {
          if(status.location == 'granted')
            this.getPosition(cb)
          else
            // permission needed
            console.log('Location permission denied')
        })
    })
  }

  openExternalApp(schema: string) {
    // open external android / ios app using capacitor's App Launcher API
    AppLauncher.canOpenUrl({url: schema})
    .then(result => {
      if(!result.value){
        // cannot open app
        return
      }
    })

  }

  openApp(schema: string){
    AppLauncher.openUrl({url: schema})
    .then(result => {
      if(result.completed) {
        // done
      }
    })
    .catch()
  }


  toggleFlashlight() {
    const status = Flash.isSwitchedOn();
    if (false) {
      Flash.switchOn({intensity: 1.0});
    } else {
      Flash.switchOff();
    }
  }

  getPosition(cb?: (err:any, pos:any)=>void){
    Geolocation.getCurrentPosition()
    .then(position => {
      if(cb) cb(null, position)
      this.eventbus.dispatch('position', position.coords.latitude, position.coords.longitude, position.coords.accuracy)
    })
    .catch(err => {
      if(cb) cb(err, null)
    })
  }




  exitApp() {
    App.exitApp();
  }

  callPhone(number: string) {
    if(Capacitor.getPlatform() === 'web') {
      window.open(`tel:${number}`, '_system');
      return;
    }else{
      CallNumber.call({number: number, bypassAppChooser: true})
      .then(call=>{
        console.log('calling', number, call.message)
      })
    }
  }

  sendSms(param: {number: string, text: string}){
    SmsManager.send({
      numbers: [param.number],
      text: param.text,
    }).then(() => {
        // success
    }).catch(error => {
        console.error('sending sms',error);
    });
  }


  calibration(){

  }

  run(id:number){

    let action =  this.actions.find(act=>act.id==id);
    // if(action) return this.eventbus.dispatch(action.cb, ...action.cbArgs)
    if (action) {
      let cb: (...arg:any[])=>void = ()=>{};
      switch (action.type) {
        case 1:
          cb = this.callPhone.bind(this)
        break;

        case 2:
          cb = this.sendSms.bind(this)
          break;

        case 3:
          cb = this.toggleFlashlight.bind(this)
        break;

        case 4:
          let cb1 = (err:any, position:any)=>{
            if(err) return;
            this.sendSms({number: action.cbArgs[0], text: `location details: ${JSON.stringify(position)}`})
          }
          cb = ()=>{this.getLocation(cb1)}
        break;

        default:
        break;
      }

      cb(...action.cbArgs)
      console.log('running action', action, cb, action.cbArgs)
    }
  }

  add(id:number, input: { name: string, type: number, cbArgs: any[] }){
    let action =  this.actions.find(act=>act.id==id);
    let acttypes = this.SysAction.find(act=>act.type==input.type);
    if(!acttypes) {
      console.warn('Invalid action type', input.type)
      return
    }
    if(action) {
      Dialog.confirm({
        title: 'Overwrite action?',
        message: 'The gesture is already connected to an action, do you want to overwrite it?',
      })
      .then(result => {
        if(result.value) {
          this.actions[this.actions.indexOf(action)] = {
            id: id,
            name: input.name,
            type: input.type,
            cbArgs: input.cbArgs,
            enabled: true
          }
        }else{
          console.warn('Gesture is already connected to an action', action)
        }
      })
      // console.warn('Gesture is already connected to an action', action)
      return;
    }

    this.actions.push({
      id: id,
      name: input.name,
      type: input.type,
      cbArgs: input.cbArgs,
      enabled: true
    })
  }

  save() {
    if(!this.loaded) return
    return Filesystem.writeFile({
      data: JSON.stringify(this.actions),
      directory: Directory.Data,
      path: 'actions',
      encoding: this.Encoding
    }).then(
      ()=>{
        this.eventbus.dispatch('save', this.actions);
        return;
      }
    )
  }


  load() {
    Filesystem.readdir({
      path: '',
      directory: Directory.Data
    })
    .then(
      (dir)=>{
        let file = dir.files.find(f=>f.name=='actions');
        if(!file){
          this.eventbus.dispatch('loaded', this.actions)
          this.save();
          return;
        }

        Filesystem.readFile({
          directory: Directory.Data,
          path: 'actions',
          encoding: this.Encoding
        })
        .then(
          (files)=>{
            this.actions = JSON.parse(files.data as string);
            this.eventbus.dispatch('loaded', this.actions)
          }
        )
        .catch(err=>{
          // unable to read saved data
          // i dont have time to continue on this possibility
          console.error('error during readFile in actionService', err);
          Filesystem.deleteFile({
            directory: Directory.Data,
            path: 'actions'
          }).then(
            (data)=>{
              this.eventbus.dispatch('loaded', this.actions)
              this.save();
            }
          )
        })

      }
    )
  }

}
