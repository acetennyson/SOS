import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-circular-progress',
  imports: [],
  templateUrl: './circular-progress.component.html',
  styleUrl: './circular-progress.component.css'
})
export class CircularProgressComponent {
  @Input() input: {percent: number, lastInputTime: number, colorClass?: {dark: string, light: string}} = {
    percent: 0,
    lastInputTime: 0,
    colorClass: {
      dark: 'text-green',
      light: 'text-green'
    }

  }
}
