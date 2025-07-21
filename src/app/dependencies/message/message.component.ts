import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-message',
  imports: [FormsModule, MatDialogModule],
  templateUrl: './message.component.html',
  styleUrl: './message.component.css'
})
export class MessageComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: {type?: number, message: string, value?: string, btn_pr?: string, btn_sc?: string, title: string}, public dialogRef: MatDialogRef<MessageComponent>) {}

  ngOnInit() {

    if (!this.data.btn_pr) {
      this.data.btn_pr = "Ok";
    }
    if (!this.data.btn_sc) {
      this.data.btn_sc = "Cancel";
    }

  }
  ngOnDestroy(): void {

  }

  closeDialog(s?: string) {
    this.dialogRef.close(s);
  }

  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.closeDialog(this.data.value);
    }
  }

  timeout(){
    this.closeDialog("Timeout");
  }
}
