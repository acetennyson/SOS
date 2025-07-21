import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GestureRecognitionService } from '../services/gesture-recognition.service';
import { ActionService } from '../services/action.service';

@Component({
  selector: 'app-gesture',
  imports: [RouterOutlet],
  templateUrl: './gesture.component.html',
  styleUrl: './gesture.component.css'
})
export class GestureComponent {
  constructor(public gService: GestureRecognitionService, private gAction: ActionService){
    
  }
}
