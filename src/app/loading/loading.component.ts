import { Component } from '@angular/core';

@Component({
  selector: 'app-loading',
  imports: [],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.css'
})
export class LoadingComponent {
  loadingMessage = 'Loading...';
  failed = false;


  retry(){
    
  }
}
