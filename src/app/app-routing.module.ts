import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from './Components/login/login.component';
import {HomeComponent} from './Components/home/home.component';
import {DashboardComponent} from './Components/dashboard/dashboard.component';
import {AuthGuard} from './Shared/guards/auth.guard';
import {OuterGuard} from './Shared/guards/outer.guard';
import {ProfileComponent} from './Components/profile/profile.component';
import {RegisterComponent} from './Components/register/register.component';
import {JournalComponent} from './Components/journal/journal.component';
import {MonitoringComponent} from './Components/monitoring/monitoring.component';
import {PlannerComponent} from './Components/planner/planner.component';
import {GoalComponent} from './Components/goal/goal.component';
import {InformationComponent} from './Components/information/information.component';
import {StoryboardGuard} from './Shared/guards/storyboard.guard';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [OuterGuard],
  },
  {
  path: 'login',
  component: LoginComponent,
  canActivate: [OuterGuard]
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  }
  ,
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [OuterGuard]
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'journal',
    component: JournalComponent,
    canActivate: [AuthGuard, StoryboardGuard]
  },
  {
    path: 'monitoring',
    component: MonitoringComponent,
    canActivate: [AuthGuard, StoryboardGuard]
  },
  {
    path: 'planner',
    component: PlannerComponent,
    canActivate: [AuthGuard, StoryboardGuard]
  },
  {
    path: 'goals',
    component: GoalComponent,
    canActivate: [AuthGuard, StoryboardGuard]
  },
  {
    path: 'information',
    component: InformationComponent,
    canActivate: [AuthGuard, StoryboardGuard]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
