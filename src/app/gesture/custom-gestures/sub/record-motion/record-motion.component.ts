import { Component } from '@angular/core';
import { Capacitor, PluginListenerHandle } from '@capacitor/core';
import { Motion } from '@capacitor/motion';

@Component({
  selector: 'app-record-motion',
  imports: [],
  templateUrl: './record-motion.component.html',
  styleUrl: './record-motion.component.css'
})
export class RecordMotionComponent {

  accelHandler: PluginListenerHandle | null = null;
  orientationHandler: PluginListenerHandle | null = null;
  motionEvent: DeviceMotionEvent | null = null;

  constructor() {

    // this.requestPermission();
    this.DetectMotionWeb();
  }

  DetermineDeviceMotionSupport() {


    // if (Capacitor.getPlatform() === 'ios') {
    //   const permission = await Motion.requestPermissions();
    //   if (permission.orientation !== 'granted') return;
    // }
  }

  DetectMotion() {

    Motion.addListener('accel', (data) => {
      console.log('Motion data:', data, data.acceleration);
      // detect motion and handle it
      const threshold = 12; // adjust as needed for your gesture
      const { x, y, z } = data.acceleration ?? { x: 0, y: 0, z: 0 };
      if (Math.abs(x) > threshold || Math.abs(y) > threshold || Math.abs(z) > threshold) {
        console.log('Custom gesture detected!');
        // You can emit an event, call a callback, or trigger UI updates here
      }

    })
    .then((handle: PluginListenerHandle) => {
      console.log('Motion listener added:', handle);
      this.accelHandler = handle;
    }).catch((error) => {
      console.error('Error adding motion listener:', error);
    });


    Motion.addListener('orientation', (data) => {
      console.log('Orientation data:', data);
    }).then((handle: PluginListenerHandle) => {
      console.log('Orientation listener added:', handle);
      this.orientationHandler = handle;
    }).catch((error) => {
      console.error('Error adding orientation listener:', error);
    });
  }

  requestPermission(){
    if (Capacitor.getPlatform()==='web') {
      (window.navigator as any).permissions.query({ name: 'accelerometer' }).then((result:any) => {
        if (result.state === 'granted') {
          console.log('Accelerometer permission granted', result);
        }else if (result.state === 'prompt') {
          console.log('Accelerometer permission prompt');
        } else {
          console.log('Accelerometer permission denied');
          return;
        }
      })
      .catch((e:any)=>{

      })
    }else{
      try {
        (window.DeviceMotionEvent as any)?.requestPermission();
      } catch (e) {
        // Handle error
        return;
      }
    }
  }

  DetectMotionWeb() {
    
    // if (Capacitor.getPlatform() === 'web') {
    window.addEventListener('devicemotion', (event) => {
      if (!event.acceleration) {
        console.log('Blocked by browser')
        return;
      }
      console.log('Motion data:', event);
    });

    window.addEventListener('deviceorientation', (event) => {
      console.log('Orientation data:', event);
      // You can process the orientation data here
    });
    // }
  }


  stopMotionDetection() {
    if (this.accelHandler) {
      this.accelHandler.remove().then(() => {
        this.accelHandler = null;
        console.log('Motion detection stopped.');
      }).catch((error) => {
        console.error('Error stopping motion detection:', error);
      });
    }

    if (this.orientationHandler) {
      this.orientationHandler.remove().then(() => {
        this.orientationHandler = null;
        console.log('Orientation detection stopped.');
      }).catch((error) => {
        console.error('Error stopping orientation detection:', error);
      });
    }

  }
}
