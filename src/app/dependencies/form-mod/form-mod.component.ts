import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { DefaultInput, OptionalInput } from '../../dependencies/components';
import { notify } from '../../dependencies/Elementor';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form-mod',
  imports: [FormsModule, MatDialogModule, CommonModule],
  templateUrl: './form-mod.component.html',
  styleUrl: './form-mod.component.css'
})
export class FormModComponent {
  values: {[index: string]: string|boolean} = {};
  defaultClass = "w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-body-color outline-hidden focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white";
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {inputs: Array<DefaultInput|OptionalInput>, title: string, description: string, required?:string[]}, // Optional for dialog data
    public dialogRef: MatDialogRef<FormModComponent>, // Optional for dialog
  ) {
    data.inputs.map(ip=>{
      this.values[ip.id] = ip.value==undefined?'':ip.value;
    })
    console.log('forms', data)
  }

  Submit(): void {
    event?.preventDefault()
    // Handle form submission logic here
    if(this.data.required && this.data.required.length) {
      let incomplete = this.data.required.find(key=>{
        return !this.values[key];
      })

      if(incomplete) {
        let name = this.data.inputs.find(i=>i.id==incomplete)
        notify({title: `${name?.name} is required`, message: 'please fill in the required data and complete the form before submission', type: 'warning'})
        return;
      }
    }
    this.dialogRef.close(this.values); // Close the dialog and pass the values
  }

}
