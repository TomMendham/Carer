import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../environments/environment';
import {AngularFireAuthModule} from '@angular/fire/auth';
import { LoginComponent } from './Components/login/login.component';
import { HeaderComponent } from './Components/header/header.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialModule} from './material';
import { HomeComponent } from './Components/home/home.component';
import { DashboardComponent } from './Components/dashboard/dashboard.component';
import {AuthService} from './Shared/services/auth.service';
import { LayoutModule } from '@angular/cdk/layout';
import {AngularFirestore, AngularFirestoreModule} from '@angular/fire/firestore';
import {UserService} from './Shared/services/user.service';
import { ProfileComponent } from './Components/profile/profile.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RegisterComponent} from './Components/register/register.component';
import {InviteDialogComponent} from './Components/profile/invite-dialog/invite-dialog.component';
import {JournalComponent} from './Components/journal/journal.component';
import { EditDialogComponent } from './Components/journal/edit-dialog/edit-dialog.component';
import {MonitoringComponent} from './Components/monitoring/monitoring.component';
import {WeightDialogComponent} from './Components/monitoring/weight-dialog/weight-dialog.component';
import {HeightDialogComponent} from './Components/monitoring/height-dialog/height-dialog.component';
import {MedicationDialogComponent} from './Components/monitoring/medication-dialog/medication-dialog.component';
import {PlannerComponent} from './Components/planner/planner.component';
import {CalendarModule, DateAdapter} from 'angular-calendar';
import {adapterFactory} from 'angular-calendar/date-adapters/date-fns';
import {NgbModalModule} from '@ng-bootstrap/ng-bootstrap';
import {CommonModule} from '@angular/common';
import {FlatpickrModule} from 'angularx-flatpickr';
import {FlexLayoutModule} from '@angular/flex-layout';
import {AddEventDialogComponent} from './Components/planner/add-event-dialog/add-event-dialog.component';
import {MatSlideToggleModule, MatGridListModule, MatCardModule, MatMenuModule, MatIconModule, MatButtonModule} from '@angular/material';
import {PlanningService} from './Shared/services/planning.service';
import {MonitoringService} from './Shared/services/monitoring.service';
import {ViewEventDialogComponent} from './Components/planner/view-event-dialog/view-event-dialog.component';
import {GoalComponent} from './Components/goal/goal.component';
import {AddGoalDialogComponent} from './Components/goal/add-goal-dialog/add-goal-dialog.component';
import {InformationComponent} from './Components/information/information.component';
import {FileDropModule} from 'ngx-file-drop';
import {AngularFireStorageModule} from '@angular/fire/storage';
import {UploaderDialogComponent} from './Components/information/uploader-dialog/uploader-dialog.component';
import {InformationService} from './Shared/services/information.service';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {AddStoryboardDialogComponent} from './Components/profile/add-storyboard-dialog/add-storyboard-dialog.component';
import {EditGoalDialogComponent} from './Components/goal/edit-goal-dialog/edit-goal-dialog.component';
import {EditMedicationDialogComponent} from './Components/monitoring/edit-medication-dialog/edit-medication-dialog.component';
import {EditEventDialogComponent} from './Components/planner/edit-event-dialog/edit-event-dialog.component';
import {AddJournalDialogComponent} from './Components/journal/add-journal-dialog/add-journal-dialog.component';
import {NoStoryboardDialogComponent} from './Components/dashboard/no-storyboard-dialog/no-storyboard-dialog.component';
import {FooterComponent} from './Components/footer/footer.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeaderComponent,
    HomeComponent,
    RegisterComponent,
    DashboardComponent,
    ProfileComponent,
    InviteDialogComponent,
    JournalComponent,
    EditDialogComponent,
    MonitoringComponent,
    WeightDialogComponent,
    HeightDialogComponent,
    MedicationDialogComponent,
    PlannerComponent,
    AddEventDialogComponent,
    ViewEventDialogComponent,
    GoalComponent,
    AddGoalDialogComponent,
    InformationComponent,
    UploaderDialogComponent,
    AddStoryboardDialogComponent,
    EditGoalDialogComponent,
    EditMedicationDialogComponent,
    EditEventDialogComponent,
    AddJournalDialogComponent,
    NoStoryboardDialogComponent,
    FooterComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    BrowserAnimationsModule,
    MaterialModule,
    LayoutModule,
    ReactiveFormsModule,
    FormsModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    NgbModalModule,
    FlatpickrModule.forRoot(),
    CommonModule,
    FlexLayoutModule,
    MatSlideToggleModule,
    FileDropModule,
    AngularFireStorageModule,
    AngularFirestoreModule,
    ScrollingModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule
  ],
  entryComponents: [
    InviteDialogComponent,
    EditDialogComponent,
    HeightDialogComponent,
    WeightDialogComponent,
    MedicationDialogComponent,
    AddEventDialogComponent,
    ViewEventDialogComponent,
    AddGoalDialogComponent,
    UploaderDialogComponent,
    AddStoryboardDialogComponent,
    EditGoalDialogComponent,
    EditMedicationDialogComponent,
    EditEventDialogComponent,
    NoStoryboardDialogComponent,
    AddJournalDialogComponent],
  providers: [
    AuthService,
    AngularFirestore,
    UserService,
    PlanningService,
    MonitoringService,
    InformationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
