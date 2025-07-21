import { CommonModule } from '@angular/common';
import { Component, Inject, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { RouterService } from '../../services/router.service';
import { RuntimeService } from '../../services/runtime.service';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
})
export class SignUpComponent {
  isDialog: boolean = false;

  constructor(
    @Optional() public dialogRef: MatDialogRef<SignUpComponent>, // Optional for dialog
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any, // Optional for dialog data
    private route: ActivatedRoute, // For route-based usage
    public user: UserService,
    private runtime: RuntimeService,
    private router: RouterService

  ) {
    // Determine if the component is being used as a dialog
    this.isDialog = !!dialogRef;
    // if(dialogRef) dialogRef.disableClose = true;
  }

  closeDialog(): void {
    this.dialogRef.close(); // Close the dialog if it's a dialog
  }

  Signin() {
    console.log('s')
    if(this.isDialog){
      this.closeDialog();
      this.runtime.eventbus.dispatch('signin', true);
    }else{
      this.router.goto('/signin');
    }
  }

  onSubmit(): void {
    event?.preventDefault()
    // Handle form submission logic here
    console.log('Form submitted');
    if(this.isDialog) this.closeDialog()
  }
}
