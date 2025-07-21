import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { VolumeButtons, VolumeButtonsOptions } from '@capacitor-community/volume-buttons';
import { CircularProgressComponent } from '../../../../dependencies/circular-progress/circular-progress.component';

@Component({
  selector: 'app-record-gesture',
  imports: [CommonModule],
  templateUrl: './record-gesture.component.html',
  styleUrl: './record-gesture.component.css'
})
export class RecordGestureComponent {

}


interface DrawResult{
  action: string,
}

interface ScreenTaps{
  action: string, // position of tap, x y
  duration: 0, // duration of tap
  interval: 0 // interval of taps
}

interface ButtonPress{
  action: string, // volume up, volume down
  duration: number, // duration of button press
  interval: number // interval of button presses
}

/* {
  action, (speech)
  duration of action,
  // interval of actions
}
 */
