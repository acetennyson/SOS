import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-welcome',
  imports: [RouterLink],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css'
})
export class WelcomeComponent implements AfterViewInit{
  @ViewChild('welcomeImage') image!: ElementRef<HTMLImageElement>;

  ngAfterViewInit(): void {
    const [width, ratio, ratioLimit] = [ Math.min(innerWidth, innerHeight), innerWidth/innerHeight, (610/778) ];
    console.log(ratio, ratioLimit);
    if(ratio>ratioLimit){
      // this.image.nativeElement.style.width = `${width}px`;
    }
  }

}
