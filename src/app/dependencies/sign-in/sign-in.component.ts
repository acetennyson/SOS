import { CommonModule } from '@angular/common';
import { Component, Inject, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { RouterService } from '../../services/router.service';
import { RuntimeService } from '../../services/runtime.service';
import { FormsModule } from '@angular/forms';
import { WebService } from '../../services/web.service';
import { MessageService } from '../../services/message.service';
import { notify } from '../Elementor';

@Component({
  selector: 'app-sign-in',
  imports: [CommonModule, MatDialogModule, FormsModule],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css'
})
export class SignInComponent {
  isDialog: boolean = false;
  username: string = '';
  password: string = '';

  constructor(
    @Optional() public dialogRef: MatDialogRef<SignInComponent>, // Optional for dialog
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any, // Optional for dialog data
    private messageService: MessageService,
    public user: UserService,
    private runtime: RuntimeService,
    private web: WebService,
    private router: RouterService
  ) {
    // Determine if the component is being used as a dialog
    this.isDialog = !!dialogRef;
    // if(dialogRef) dialogRef.disableClose = true;
  }

  closeDialog(): void {
    this.dialogRef.close(); // Close the dialog if it's a dialog
  }

  Signup() {
    if(this.isDialog){
      this.closeDialog();
      this.runtime.eventbus.dispatch('signup', true);
    }else{
      this.router.goto('/register');
    }
  }

  SignIn(){
    this.web.SignIn(this.username, this.password).subscribe(
      (data: any) => {
        if(data.error) {
          this.messageService.alert({title: 'Authentication Error', message: data.error.message})
        }else{
          console.log('userInfo', data.data);
          this.user.user = data.data.user;
          // this.user.permission = data.data.permission;
          this.messageService.alert({title: 'Alert', message: 'Authentication Successful'})

          if(this.isDialog){
            this.closeDialog();
          }else{
            this.router.goto('/app/task');
          }
        }
      }
    )
  }

  onSubmit(): void {
    event?.preventDefault()
    // Handle form submission logic here
    console.log('Form submitted');
    this.SignIn()
  }
}
