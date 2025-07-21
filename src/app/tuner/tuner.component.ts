import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-tuner',
  imports: [],
  templateUrl: './tuner.component.html',
  styleUrl: './tuner.component.css'
})
export class TunerComponent implements AfterViewInit {
  @Input() data: {title: string, description: string, serviceInfo: {[index: string]: any}} = {title:'Tuner', description:'', serviceInfo: {}};
  @ViewChild('knob') knob!: ElementRef<HTMLDivElement>;
  isDragging = false;
  currentAngle = 0;
  percent = 0; // Variable to represent range percentage
  center = { x: 0, y: 0 };
  constructor() {
    // Initialize the knob element
    // this.knob = document.getElementById('knob');
  }

  ngAfterViewInit() {
    // Initialize the knob element
    // const knob = document.getElementById('knob');

    this.knob.nativeElement.addEventListener('touchstart', this.mouseDown.bind(this));
    document/* this.knob.nativeElement */.addEventListener('touchmove', (event:any) => {
      if (this.isDragging) {
        event.preventDefault(); // Prevent default touch behavior
        this.rotateKnob(event.touches[0], this.center);
      }
    });
    document/* this.knob.nativeElement */.addEventListener('touchend', () => {
      this.isDragging = false;
    });
    document/* this.knob.nativeElement */.addEventListener('touchcancel', () => {
      this.isDragging = false;
    });
    /* this.knob.nativeElement.addEventListener('touchleave', () => {
      this.isDragging = false;
    }); */
    
    // Add mouseup event listener to the document
    // to handle the case when the mouse is released outside the knob
    // This ensures that the knob stops rotating when the mouse is released
    // even if the mouse is not over the knob
    // This is important for a better user experience
    // and to prevent the knob from getting stuck in a dragging state

    this.knob.nativeElement.addEventListener('mousedown', this.mouseDown.bind(this));
    document.addEventListener('mousemove', (event) => {
      if (this.isDragging) {
        event.preventDefault(); // Prevent default mouse behavior
        this.rotateKnob(event, this.center);
      }
    });
    document.addEventListener('mouseup', () => {
      this.isDragging = false;
    });

  }

  rotateKnob(e:any, center:any) {
    // Calculate the angle based on mouse position
    // and the center of the knob
    const x = e.clientX - center.x;
    const y = e.clientY - center.y;
    const angle = Math.atan2(y, x) * (180 / Math.PI) + 90;
    
    // Ensure the angle stays within 0° to 360° range
    this.currentAngle = angle < 0 ? angle + 360 : angle;
    this.knob.nativeElement.style.transform = `rotate(${this.currentAngle}deg)`;
    
    // Calculate the percentage based on the angle
    this.percent = Math.round((this.currentAngle / 360) * 100);
    console.log(`Percent: ${this.percent}%`); // Log the percentage for testing
  }

  mouseDown(e:any) {
    this.isDragging = true;

    this.center = {
      x: this.knob.nativeElement.getBoundingClientRect().left + this.knob.nativeElement.offsetWidth / 2,
      y: this.knob.nativeElement.getBoundingClientRect().top + this.knob.nativeElement.offsetHeight / 2
    };

  }


}
