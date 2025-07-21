import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MessageComponent } from '../dependencies/message/message.component';
import { SignUpComponent } from '../dependencies/sign-up/sign-up.component';
import { SignInComponent } from '../dependencies/sign-in/sign-in.component';
import { FormModComponent } from '../dependencies/form-mod/form-mod.component';
import { DefaultInput, OptionalInput } from '../dependencies/modalInput';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  messages: string[] = [];
  temporary?: string;
  pval?: string;
  cval?: number;
  boxvalue?: any;
  oldOpen?: MatDialogRef<MessageComponent, any>;
  currentOpen?: MatDialogRef<MessageComponent, any>;

  add(message: string){
    this.messages.push(message);
  }
  _addTemp(message: string){
    this.temporary = message;
  }

  clear(){
    this.messages = [];
    this.temporary = undefined;
  }

  openAlertDialog(params: {type?:number, message: string, value?: string, title: string}, enterAnimationDuration: string, exitAnimationDuration: string) {
    if (this.currentOpen) {
      this.oldOpen = this.currentOpen;
      this.currentOpen = undefined;
      this.oldOpen.close(Infinity);
    }
    let d = this.dialog.open(MessageComponent, {
      data: params,
      width: 'auto',
      enterAnimationDuration,
      exitAnimationDuration,
    });
    this.currentOpen = d;
    this.boxvalue = undefined;
    return d;
  }

  alert(param:{message: string, title: string, okBtn?: string,}){
    let params: {type?: number, message: string, btn_pr?: string, title: string} = {type: 0, message: param.message, btn_pr: param.okBtn, title: param.title};
    let d = this.openAlertDialog(params, '0ms', '0ms');
    return d;
  }

  confirm(param:{message: string, title: string, okBtn?: string, cancelBtn?:string}){
    let params: {type?: number, message: string, btn_pr?: string, btn_sc?: string, title: string} = {type: 1, message: param.message, btn_pr: param.okBtn, btn_sc: param.cancelBtn, title: param.title};
    let d =  this.openAlertDialog(params, '0ms', '0ms');
    return d;
  }

  prompt(param:{message: string, title: string, value?:string, okBtn?: string, cancelBtn?:string}){
    let params: {type?: number, message: string, value?: string, title: string, btn_pr?:string, btn_sc?:string} = {type: 2, message: param.message, value: param.value, title: param.title, btn_pr: param.okBtn, btn_sc: param.cancelBtn};
    let d = this.openAlertDialog(params, '0ms', '0ms');
    return d;
  }

  vAlert(params: {title: string, message: string}){
    // if(!params.type) params.type = 0;
    return this.openAlertDialog(params, '1200ms', '1100ms');
  }

  acealert(i:number = 0, cb: any, message: string, value?: string){

  }


  openSignupDialog( enterAnimationDuration: string = '0ms', exitAnimationDuration: string = '0ms') {

    let d = this.dialog.open(SignUpComponent, {
      width: 'auto',
      enterAnimationDuration,
      exitAnimationDuration,
    });

    return d;
  }

  openSigninDialog( enterAnimationDuration: string = '0ms', exitAnimationDuration: string = '0ms') {

    let d = this.dialog.open(SignInComponent, {
      width: 'auto',
      enterAnimationDuration,
      exitAnimationDuration,
    });

    return d;
  }

  openForm(data:{ title: string, description?: string, required?: string[], inputs: Array<DefaultInput | OptionalInput>}, enterAnimationDuration: string = '0ms', exitAnimationDuration: string = '0ms'){
    let d = this.dialog.open(FormModComponent, {
      data: data,
      width: 'auto',
      enterAnimationDuration,
      exitAnimationDuration
    })
    return d;
  }

  constructor(public dialog: MatDialog) {}
}
