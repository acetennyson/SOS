import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CustomAction, SysAction } from '../../dependencies/components';
import { RuntimeService } from '../../services/runtime.service';
import { RouterService } from '../../services/router.service';
import { Dialog } from '@capacitor/dialog';
import { GestureRecognitionService } from '../../services/gesture-recognition.service';
import { ActionService } from '../../services/action.service';
import { MessageService } from '../../services/message.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-main-create-custom-gestures',
  imports: [FormsModule],
  templateUrl: './set-action.component.html',
  styleUrl: './set-action.component.css'
})
export class SetActionComponent {
  /* Example gesture types
  gestureTypes = [
    {
      id: 1,
      title: "Shake Phone",
      description: "Shake vigourously to trigger",
      class: "fa fa-mobile fs-1"
    },
    {
      id: 2,
      title: "Power Button",
      description: "press power button to trigger action",
      class: "fa fa-mobile fs-1"
    },
    {
      id: 3,
      title: "Volume +",
      description: "Press volume + to trigger",
      class: "fa fa-mobile fs-1"
    },
    {
      id: 4,
      title: "Volume -",
      description: "Press volume - to trigger",
      class: "fa fa-mobile fs-1"
    },
    {
      id: 5,
      title: "Screen Touch",
      description: "Draw or Touch Areas on screen",
      class: "fa fa-mobile fs-1"
    }
  ]
   */
  actionTypes: SysAction[];

  selectedBaseAction: number = 0;
  selectedGesture: number = 0;

  constructor(private route: ActivatedRoute, public runtime: RuntimeService, private gAction: ActionService, private router: RouterService, private gService: GestureRecognitionService, private messageService: MessageService) {
    this.actionTypes = this.gAction.SysAction.filter(g=>g.enabled);

    /* this.route.params.subscribe(params=>{
      console.log('gesture ID: ', params['gestureId'])
      this.selectedGesture = params['gestureId']
    }) */

    this.route.queryParams.subscribe(params=>{
      console.log('gesture ID: ', params['gestureId'])
      this.selectedGesture = params['gestureId']||0
    })
  }

  RecordAction() {
    if(!this.selectedGesture) {
      console.warn('select a valid gesture')
      return;
    }
    if(!this.selectedBaseAction) {
      console.warn('select a gesture type')
      return;
    }

    let selectedActionType = this.actionTypes.find(gt=>gt.type==this.selectedBaseAction);
    let selectedGesture = this.gService.allGestures.find(gt=>gt.id==this.selectedGesture);

    // console.log("Start Recording", {gestureType, name: this.gestureName, rythmic: this.rythmicDetection});
    console.log('gesture type', this.selectedBaseAction)
    switch (this.selectedBaseAction) {
      case 1:
        // call parameter
        this.messageService.openForm({
          title: 'Add Action',
          inputs: [
            {
              id: 'name',
              name: 'name',
              type: 'default',
              label: 'Action Label',
              value: ''
            },
            {
              id: 'number',
              name: 'number',
              type: 'default',
              label: 'Phone Number (+237-xxx-xxx-xxx)',
              value: ''
            }
          ],
          required: ['name', 'number']
        })
        .afterClosed()
        .subscribe((res:any) => {
          console.log('res', res);
          if(!res) return;
          this.gAction.add(this.selectedGesture, {
            name: res.name,
            type: this.selectedBaseAction,
            cbArgs: [res.number]
          });
          this.gAction.save();
          this.router.back();
        })
      break;

      case 2:
        // 1+1
        this.messageService.openForm({
          title: 'Add Action',
          inputs: [
            {
              id: 'name',
              name: 'name',
              type: 'default',
              label: 'Action Label',
              value: ''
            },
            {
              id: 'number',
              name: 'number',
              type: 'default',
              label: 'Phone Number (+237-xxx-xxx-xxx)',
              value: ''
            },
            {
              id: 'message',
              name: 'message',
              type: 'default',
              label: 'Message',
              value: ''
            }
          ],
          required: ['name', 'number', 'message']
        })
        .afterClosed()
        .subscribe((res:any) => {
          console.log('res', res);
          if(!res) return;
          this.gAction.add(this.selectedGesture, {
            name: res.name,
            type: this.selectedBaseAction,
            cbArgs: [{number: res.number, text:res.message}]
          });
          this.gAction.save();
          this.router.back();
        })
      break;

      case 3:
        // 1+1
        this.gAction.add(this.selectedGesture, {
          name: 'Toggle Flashlight',
          type: this.selectedBaseAction,
          cbArgs: []
        });
        this.gAction.save();
        this.router.back();
      break;

      default:
        // 1+1
      break;
    }

  }
}
