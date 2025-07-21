import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-custom-gestures',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './custom-gestures.component.html',
  styleUrl: './custom-gestures.component.css'
})
export class CustomGesturesComponent {

}
