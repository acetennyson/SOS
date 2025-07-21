import { Component, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TunerComponent } from "./tuner/tuner.component";
import { Filesystem, Directory } from '@capacitor/filesystem';

import { RuntimeService } from './services/runtime.service';
import { UserService } from './services/user.service';
import { RouterService } from './services/router.service';
import { GestureRecognitionService } from './services/gesture-recognition.service';
import { ActionService } from './services/action.service';
import { ScreenOrientation, OrientationLockType } from '@capacitor/screen-orientation'
import { VolumeButtons } from '@capacitor-community/volume-buttons';
import { Capacitor } from '@capacitor/core';
import { Dialog } from '@capacitor/dialog';
// import { BackgroundRunner } from '@capacitor/background-runner';
import { Motion } from '@capacitor/motion';
import { App } from '@capacitor/app';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  // @ViewChild(TunerComponent) tuner1!: TunerComponent;
  title = 'XOX';
  allLoaded = false;

  constructor(private runtime: RuntimeService, public user: UserService, private gService: GestureRecognitionService, private gAction: ActionService, private router: RouterService){
    user.eventbus.subscribe('save', ()=>{
      // user.save();
      gService.save();
      gAction.save();
    })
    user.eventbus.subscribe('allLoaded', ()=>{
      this.allLoaded = true;
      // this.testSave()
      // this.bgListenGestures();
    })
    user.eventbus.subscribe('loaded', ()=>{
      if(Capacitor.getPlatform() != 'android'){
        Dialog.alert({
          title: 'Warning',
          message: 'This app is only supported on Android devices.',
        })
        .finally(()=>{
          this.router.goto('/loading');
        })
      }
      if(gService.loaded && gAction.loaded){
        user.eventbus.dispatch('allLoaded', {user:user.user, gestures:gService.allGestures, actions:gAction.actions})
      }
      router.goto('welcome')
    })

    gService.eventbus.subscribe('performAction', (gestureId)=>{

      if(gestureId){
        gAction.run(gestureId);
      }
    });

    gService.eventbus.subscribe('save', (allgestures)=>{
      // this.testSave()
    })

    gAction.eventbus.subscribe('save', (actions)=>{
      // this.testSave();
    })
    gService.eventbus.subscribe('loaded', ()=>{
      if(user.loadedData && gAction.loaded){
        user.eventbus.dispatch('allLoaded', {user:user.user, gestures:gService.allGestures, actions:gAction.actions})
      }
    })

    gAction.eventbus.subscribe('loaded', ()=>{
      console.log('actions loaded', gAction.actions)
      if(user.loadedData && gService.loaded){
        user.eventbus.dispatch('allLoaded', {user:user.user, gestures:gService.allGestures, actions:gAction.actions})
      }
    })


    try {
      ScreenOrientation.lock({orientation: 'portrait-primary'});
      ScreenOrientation.addListener('screenOrientationChange', (orientation)=>{
        console.log('orientation', orientation.type)
      })
    } catch (error) {
      console.warn('ScreenOrientation Error:', error)
    }
/*
    try {
      BackgroundRunner.checkPermissions()
      .then((result) => {
        if(Object.values(result).find(v=>v !== 'granted')) {
          // request permission
          BackgroundRunner.requestPermissions({
            apis: [
              'geolocation',
              'notifications',
            ]
          })
          .then((result) => {
            console.log('permissions', result)
            if(Object.values(result).find(v=>v !== 'granted')) {
              console.error('permissions not granted')
              return
            }
            // permissions granted
          })
        }
        // permissions granted

      })
    } catch (error) {

    }
 */

    App.addListener('appStateChange', (state)=>{
      // if(user.loadedData && gAction.loaded && gService.loaded){
      //   this.testSave()
      // }
      // this.bgListenGestures()
      // if(this.allLoaded) this.testSave()
    })

    App.addListener('pause', ()=>{
      // this.testSave2();
    })

    App.addListener('resume', ()=>{
      // if(this.allLoaded) this.testSave();
    })

  }

/*
  testSave() {
    BackgroundRunner.dispatchEvent({
      label: 'com.iamsupreme.xox.task',
      event: 'passdata',
      details: {
        gestures: this.gService.allGestures,
        actions: this.gAction.actions,
        timeout: this.gService.recordTimeOut
      }
    }).then(
      (result)=>{
        console.log('myCustomEvent passdata', result)
      }
    )

  }

  testSave2() {
    BackgroundRunner.dispatchEvent({
      label: 'com.iamsupreme.xox.task',
      event: 'changedata',
      details: {}
    }).then(
      (result)=>{
        console.log('myCustomEvent changedata', result)
      }
    )

  }

  async bgListenGestures() {

    BackgroundRunner.dispatchEvent({
      label: 'com.iamsupreme.xox.task',
      event: 'listenForGestures',
      details: {
        volume: VolumeButtons,
        motion: Motion,
        gestures: this.gService.allGestures,
        actions: this.gAction.actions,
        timeout: this.gService.recordTimeOut,
        open: (await App.getState()).isActive
      },
    })
  }

 */


}
