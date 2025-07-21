import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import EventBus from '../dependencies/Eventbus';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class RouterService {

  exitMode: boolean = true;
  exitSure:boolean = false;
  eventbus: EventBus = new EventBus();
  currentPage = '';
  prevPage = '';

  previous?:string;
  now?: string = "/";
  history:string[] = [];

  constructor(private router: Router, private location: Location) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => {return false}
  }

  reload2(){
    let url = this.router.url
    this.router.navigate([`/${url}`]).then(()=>{
      console.log(`After navigation I am on:${this.router.url}`)
    })
  }

  reload(){
    let url = this.router.url
    this.router.navigateByUrl( '/', {skipLocationChange:true} ).then(()=>{
      this.router.navigate([`/${url}`]).then(()=>{
        console.log(`After navigation I am on:${this.router.url}`)
      })
    })
  }

  back(){
    this.location.back();
  }

  nowin(s: string) {
    this.prevPage = this.currentPage;
    this.currentPage = s;
  }

  goto(s:string){
    let result = this.router.navigate([s]);
    return result.then(
      () => {
        this.eventbus.dispatch('loaded', s)
        return true
      },
      (err: any) => {
        return false
      }
    )
  }
}
