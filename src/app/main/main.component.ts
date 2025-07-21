import { Component } from '@angular/core';
import { HeaderBarComponent } from '../header-bar/header-bar.component';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from "../sidebar/sidebar.component";

@Component({
  selector: 'app-main',
  imports: [HeaderBarComponent, RouterOutlet, SidebarComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {

}
