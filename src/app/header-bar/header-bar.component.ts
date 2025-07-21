import { Component, Input } from '@angular/core';
import { RuntimeService } from '../services/runtime.service';
import { RouterService } from '../services/router.service';

@Component({
  selector: 'app-header-bar',
  imports: [],
  templateUrl: './header-bar.component.html',
  styleUrl: './header-bar.component.css'
})
export class HeaderBarComponent {
  constructor(public runtime: RuntimeService, private router: RouterService) {
  }

  goback(){
    this.router.back();
  }
}
