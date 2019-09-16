import {Component, OnDestroy, OnInit} from '@angular/core';
import {BreakpointObserver, Breakpoints, BreakpointState} from '@angular/cdk/layout';
import {map} from 'rxjs/operators';
import {UserService} from '../../Shared/services/user.service';
import {UserDetails} from '../../Shared/classes/user.model';
import {Journal} from '../../Shared/classes/journal.model';
import {EditDialogComponent} from '../journal/edit-dialog/edit-dialog.component';
import {MatDialog} from '@angular/material';
import {AddStoryboardDialogComponent} from '../profile/add-storyboard-dialog/add-storyboard-dialog.component';
import {NoStoryboardDialogComponent} from './no-storyboard-dialog/no-storyboard-dialog.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  cols = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        console.log(matches);
        return 1;
      }
      return 3;
    })
  );
  userSubscription;
  currentUser: UserDetails;
  canView = true;
  storyboardSubscription;
  storyboardName: string;

  constructor(private breakpointObserver: BreakpointObserver, private userService: UserService, public dialog: MatDialog) { }

  ngOnInit() {
    this.userService.getUserInformation();
    this.userSubscription = this.userService.userChanged.subscribe(isUser => {
      this.currentUser = isUser;
      if (!this.currentUser.currentStoryboard) {
        this.openDialog();
      } else {
        this.canView = false;
        this.userService.getStoryboardName(this.currentUser.currentStoryboard);
        this.storyboardSubscription = this.userService.storyboardName.subscribe( name => {
          this.storyboardName = name;
        });
      }
    });
    }

  ngOnDestroy() {
    console.log('leaving dashboard');
    this.userSubscription.unsubscribe();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(NoStoryboardDialogComponent, {
      width: '500px',
    });
  }
}
