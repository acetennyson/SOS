import { Routes } from '@angular/router';
import { WelcomeComponent } from './welcome/welcome.component';
import { LoadingComponent } from './loading/loading.component';
import { SigninComponent } from './signin/signin.component';
import { RegisterComponent } from './register/register.component';
import { RegisterPersonalComponent } from './register/subs/register-personal/register-personal.component';
import { MainComponent } from './main/main.component';
import { MainCreateCustomGesturesComponent } from './gesture/custom-gestures/sub/main-create-custom-gestures/main-create-custom-gestures.component';
import { GestureComponent } from './gesture/gesture.component';
import { CustomGesturesComponent } from './gesture/custom-gestures/custom-gestures.component';
import { ViewGesturesComponent } from './gesture/view-gestures/view-gestures.component';
import { RecordGestureComponent } from './gesture/custom-gestures/sub/record-gesture/record-gesture.component';
import { DrawGestureComponent } from './gesture/custom-gestures/sub/draw-gesture/draw-gesture.component';
import { RecordButtonComponent } from './gesture/custom-gestures/sub/record-button/record-button.component';
import { RecordMotionComponent } from './gesture/custom-gestures/sub/record-motion/record-motion.component';
import { HomeComponent } from './home/home.component';
import { SetActionComponent } from './gesture/set-action/set-action.component';

export const routes: Routes = [
    {path: '', redirectTo: '/loading', pathMatch: 'full'},
    {path: 'loading', component: LoadingComponent},
    {path: 'welcome', component: WelcomeComponent},
    {path: 'signin', component: SigninComponent},
    {path: 'register', component: RegisterComponent, children: [
      {
        path: '',
        component: RegisterPersonalComponent
      }
    ]},
    {path: 'app', component: MainComponent, children: [
        {path: '', component: HomeComponent},
        {path: 'gestures', component: GestureComponent, children: [

            // {path: '', component: MainGesturesComponent},
            {path: 'get', component: ViewGesturesComponent},
            {path: 'setaction', component: SetActionComponent},
            {path: 'create', component: CustomGesturesComponent, children: [
              {path: '', component: MainCreateCustomGesturesComponent},
              {path: 'record', children: [
                {path: '', component: RecordGestureComponent},
                {path: 'button', component: RecordButtonComponent},
                {path: 'motion', component: RecordMotionComponent},
                {path: 'draw', component: DrawGestureComponent}
              ]},
            ]},
            {path: 'custom', component: CustomGesturesComponent, children: [
                // {path: '', component: ViewCustomGesturesComponent},
            ]},
        ]},
        // {path: 'actions'}
    ]}

];

/* const routes: Routes = [
    {path: '', redirectTo: '/root', pathMatch: 'full'},
    {path: 'root', component: HomeComponent},
    {path: 'welcome', component: WelcomeComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'home', component: HomepageComponent, children: [
      {
          path: '',
          component: Theme1Component
      }
    ]},
    {path: 'report', component: ReportComponent},
]; */
