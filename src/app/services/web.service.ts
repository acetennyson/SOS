import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WebService {

  constructor(private http: HttpClient) { }

  SignIn(username:string, password:string){
    return this.http.post('', {})
  }
  Register(){}
}
