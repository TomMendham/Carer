import {Component, OnDestroy, OnInit} from '@angular/core';
import {JournalService} from '../../Shared/services/journal.service';
import {Journal} from '../../Shared/classes/journal.model';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../Shared/services/user.service';
import {UserDetails} from '../../Shared/classes/user.model';
import {MatDialog} from '@angular/material';
import {EditDialogComponent} from './edit-dialog/edit-dialog.component';
import {AddJournalDialogComponent} from './add-journal-dialog/add-journal-dialog.component';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-journal',
  templateUrl: './journal.component.html',
  styleUrls: ['./journal.component.css']
})
export class JournalComponent implements OnInit, OnDestroy {
  journal: Journal = {
    name: '',
    text: '',
    topic: '',
    timestamp: '',
    creator: '',
    id: ''
  };
  log: Journal;
  journalForm: FormGroup;
  userSubscription: any;
  logSubscription: any;
  currentUser: UserDetails;
  journalLogs = [];
  cols = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return 1;
      }
      return 2;
    })
  );

  constructor(public journalService: JournalService, public userService: UserService, public dialog: MatDialog, private breakpointObserver: BreakpointObserver) { }

  ngOnInit() {
    this.userSubscription = this.userService.userChanged.subscribe(isUser => { this.currentUser = isUser; });
    setTimeout( () => {
      this.loadLogs();
    }, 1000);
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
    this.logSubscription.unsubscribe();
  }

  loadLogs() {
    const array = [];
    this.journalService.getLogs(this.currentUser.currentStoryboard);
    this.logSubscription = this.journalService.logLoader.subscribe( isLog => {
        array.push({
          name: isLog.name,
          text: isLog.text,
          topic: isLog.topic,
          timestamp: isLog.timestamp,
          creator: isLog.creator,
          id: isLog.id});
      });
    this.journalLogs = array;
  }

  onDelete(journalID: string) {
    this.journalService.deleteLog(journalID, this.currentUser.currentStoryboard);
    this.reloadData();
  }

  openDialog(journal: Journal): void {
    const dialogRef = this.dialog.open(EditDialogComponent, {
      width: '500px',
      data: {name: journal.name,
        text: journal.text,
        topic: journal.topic,
        timestamp: journal.timestamp,
        creator: journal.creator,
        id: journal.id}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.journal = result;
      if (this.journal != null) {
        this.journalService.editLog(this.journal, this.currentUser);
        setTimeout(() => {
          this.reloadData();
        }, 1000);
      } else {
        console.log('you left it empty');
      }
    });
  }

  openAddJournalDialog(): void {
    const dialogRef = this.dialog.open(AddJournalDialogComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe(result => {
      this.journalForm = result;
      if (this.journalForm != null) {
        this.journal.name = this.journalForm.get('name').value.toString();
        this.journal.text = this.journalForm.get('text').value.toString();
        this.journal.topic = this.journalForm.get('topic').value.toString();
        this.journalService.createLog(this.journal, this.currentUser);
        this.reloadData();
      } else {
        console.log('you left it empty');
      }
    });
  }

  reloadData() {
    this.userSubscription.unsubscribe();
    this.logSubscription.unsubscribe();
    this.loadLogs();
  }


}
