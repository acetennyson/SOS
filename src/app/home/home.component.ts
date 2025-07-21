import { Component } from '@angular/core';
import { GestureRecognitionService } from '../services/gesture-recognition.service';
import { ActionService } from '../services/action.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  constructor(public gService: GestureRecognitionService, private gAction: ActionService) {

  }
}
