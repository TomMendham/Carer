import {Component, ChangeDetectionStrategy, ViewChild, TemplateRef, OnInit, OnDestroy} from '@angular/core';
import {startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours} from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarView} from 'angular-calendar';
import {MatDialog} from '@angular/material';
import {AddEventDialogComponent, EventDetails} from './add-event-dialog/add-event-dialog.component';
import {FormGroup} from '@angular/forms';
import {PlanningService} from '../../Shared/services/planning.service';
import {UserService} from '../../Shared/services/user.service';
import {UserDetails} from '../../Shared/classes/user.model';
import {ViewEventDialogComponent} from './view-event-dialog/view-event-dialog.component';



const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  }
};

@Component({
  selector: 'app-planner',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./planner.component.css'],
  templateUrl: './planner.component.html'
})
export class PlannerComponent implements OnInit, OnDestroy {
  @ViewChild('modalContent') modalContent: TemplateRef<any>;


  // current view
  view: CalendarView = CalendarView.Month;

  // initialise calendar view
  CalendarView = CalendarView;

  // set current view date to today's date
  viewDate: Date = new Date();

  // used to refresh view on any changes
  refresh: Subject<any> = new Subject();

  // used to store event details
  event: EventDetails = {
    name: '',
    details: '',
    startDate: '',
    endDate: '',
    allDay: false,
    id: ''
  };

  events: CalendarEvent[] = [];
  eventsFull: EventDetails[] = [];
  eventForm: FormGroup;

  // Triggers day menu
  activeDayIsOpen;

  // user details
  user: UserDetails;
  userSubscription: any;
  eventSubscription: any;

  constructor(public dialog: MatDialog,
              public planningService: PlanningService,
              public firestoreService: UserService) {}

  ngOnInit() {
    this.userSubscription = this.firestoreService.userChanged.subscribe(isUser => {
      this.user = isUser;
    });
    setTimeout(() => {
      this.loadEventLog();
      setTimeout(() => {
        this.refreshView();
      }, 1000);
    }, 1000);
  }

  ngOnDestroy() {
    if (this.userSubscription != null && this.eventSubscription != null) {
      this.userSubscription.unsubscribe();
      this.eventSubscription.unsubscribe();
    }
  }

  // click listener for day to open menu showing events
  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      this.viewDate = date;
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
    }
  }

  // handles clicks on event
  handleEvent(event: CalendarEvent): void {
    this.findEventDetails(event.title);
    console.log(this.event);
    this.openViewEventDialog(this.event);
  }

  // changes views between month, week and day
  setView(view: CalendarView) {
    this.view = view;
  }

  // refreshes the view loading in new events
  refreshView() {
    this.refresh.next();
  }

  // Supports changing of views
  // so that event listener is not open if it is open at the time
  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  // Opens the event dialog
  openAddEventDialog(): void {
    const dialogRef = this.dialog.open(AddEventDialogComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      this.eventForm = result;
      if (this.eventForm != null) {
        this.createEventLog();
      } else {
        console.log('you left it empty');
      }
    });
  }

  // Open dialog for events
  openViewEventDialog(event: EventDetails): void {
    this.userSubscription.unsubscribe();
    this.eventSubscription.unsubscribe();
    const dialogRef = this.dialog.open(ViewEventDialogComponent, {
      width: '500px',
      data: {
        name: event.name,
        details: event.details,
        startDate: event.startDate,
        endDate: event.endDate,
        allDay: event.allDay,
        id: event.id
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      const action = result;
      if (action === 'delete') {
        this.deleteEvent(this.event.id);
      } else {
        console.log('you left it empty');
      }
    });
  }

  // Create a new event log from the form
  createEventLog() {
    this.event.allDay = this.eventForm.get('allDay').value;
    this.event.details = this.eventForm.get('details').value.toString();
    this.event.name = this.eventForm.get('name').value.toString();
    this.event.startDate = this.eventForm.get('startDate').value;
    this.event.endDate = this.eventForm.get('endDate').value;
    if (this.event.allDay !== true) {
      console.log('all day not selected');
      this.event.startDate = this.calculateDate(this.eventForm.get('startDate').value, this.eventForm.get('startTime').value);
      this.event.endDate = this.calculateDate(this.eventForm.get('endDate').value, this.eventForm.get('endTime').value);
      this.planningService.createEvent(this.event, this.user.currentStoryboard);
    } else {
      console.log('all day selected');
      this.planningService.createEvent(this.event, this.user.currentStoryboard);
    }
    setTimeout(() => {
      this.loadEventLog();
      console.log('load');
      console.log(this.eventsFull);
      console.log(this.events);
    }, 1000);
  }


  // Calculate Date from time and date
  calculateDate(date: Date, time: any) {
    const datetime = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      time.toString().substring(0, 2),
      time.toString().substring(3, 5));
    return datetime;
  }

  // Load event logs from planning service
  loadEventLog() {
    const events = [];
    const eventsFull = [];
    this.planningService.loadEvent(this.user.currentStoryboard);
    this.eventSubscription = this.planningService.eventLoader.subscribe( isEventLog => {
      events.push({title: isEventLog.name,
        // actions: this.actions,
        start: isEventLog.startDate.toDate(),
        end: isEventLog.endDate.toDate()
      });
      eventsFull.push({
        name: isEventLog.name,
        details: isEventLog.details,
        startDate: isEventLog.startDate.toDate(),
        endDate: isEventLog.endDate.toDate(),
        allDay: isEventLog.allDay,
        id: isEventLog.id,
      });
    });
    this.events = events;
    this.eventsFull = eventsFull;
  }

  // Compare calendar event and event array to find the relevant event
  findEventDetails(eventName: string) {
    this.events.forEach( event => {
      if (eventName === event.title) {
        this.eventsFull.forEach( eventFull => {
          if (event.title === eventFull.name
            && event.start.getTime() === eventFull.startDate.getTime()
            && event.end.getTime() === eventFull.endDate.getTime()) {
            this.event = eventFull;
          }
        });
      }
    });
  }

  deleteEvent(eventID: string) {
    this.planningService.deleteEventLog(eventID, this.user.currentStoryboard);
    this.loadEventLog();
  }



}
