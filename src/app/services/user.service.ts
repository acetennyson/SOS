import { Injectable } from '@angular/core';
import { ButtonGesture, ShakePhonesGesture, SpeechGesture, TouchGesture } from '../dependencies/components';
import EventBus from '../dependencies/Eventbus';
import { Directory, Encoding, Filesystem } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  eventbus: EventBus = new EventBus();
  gestureList: Array<ButtonGesture|TouchGesture|SpeechGesture|ShakePhonesGesture> = []
  loadedData = true;
  user:{[index: string]: any} = {
    'username': 'acer',
    'password': 'ace123'
  }

  constructor() {
    this.eventbus.subscribe('save', this.save.bind(this))
    this.eventbus.subscribe('loaded', ()=>{
      this.loadedData = true
    })
    this.load()
  }


  save() {
    if(!this.loadedData) return
    Filesystem.writeFile({
      data: JSON.stringify(this.user),
      directory: Directory.Data,
      path: 'userdata',
      encoding: Encoding.UTF16
    })
  }


  load() {
    Filesystem.readdir({
      path: '',
      directory: Directory.Data
    })
    .then(
      (dir)=>{
        let file = dir.files.find(f=>f.name=='userdata');
        if(!file){
          this.eventbus.dispatch('loaded');
          this.eventbus.dispatch('save');
          return;
        }

        Filesystem.readFile({
          directory: Directory.Data,
          path: 'userdata',
          encoding: Encoding.UTF16
        })
        .then(
          (files)=>{
            console.log('userService file data', files)
            this.user = JSON.parse(files.data as string);
            this.eventbus.dispatch('loaded');
          }
        )
        .catch(err=>{
          // unable to read saved data
          // i dont have time to continue on this possibility
          console.error('error during readFile in userService', err);
          Filesystem.deleteFile({
            directory: Directory.Data,
            path: 'userdata'
          }).then(
            (data)=>{
              this.eventbus.dispatch('loaded', true);
              this.save();
            }
          )
        })

      }
    )
  }


  /**
   * I Ain't
   * Using this anymore
   */



}
