import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {UserService} from '../../Shared/services/user.service';
import {AuthService} from '../../Shared/services/auth.service';
import {UserDetails} from '../../Shared/classes/user.model';
import {Storyboard} from '../../Shared/classes/storyboard.model';
import {MatDialog} from '@angular/material';
import {InviteDialogComponent} from './invite-dialog/invite-dialog.component';
import {AddStoryboardDialogComponent} from './add-storyboard-dialog/add-storyboard-dialog.component';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent implements OnInit, OnDestroy {
  user: UserDetails;
  storyboard: Storyboard;
  public storyboardArray = [];
  eventSubscription;
  nameSubscription;
  memberID: string;
  cols = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return 1;
      }
      return 2;
    })
  );

  constructor(private userService: UserService, public authService: AuthService, public dialog: MatDialog,  private breakpointObserver: BreakpointObserver) { }

  ngOnInit() {
   this.loadData();
  }

  ngOnDestroy() {
    this.eventSubscription.unsubscribe();
  }

  loadData() {
    // call event emitter
    this.userService.getUserInformation();
    // Set subscription object to firestore service
    this.eventSubscription = this.userService.userChanged.subscribe(isUser => {
      this.user = isUser;
      const array = [];
      this.userService.getStoryboard();
      this.userService.storyboardChanged.subscribe( isStoryboard => {
        array.push({name: isStoryboard.name, members: isStoryboard.members, id: isStoryboard.id});
      });
      this.storyboardArray = array;
      console.log(this.storyboardArray);
    });

  }



  openDialog(storyboardID: string): void {
    const dialogRef = this.dialog.open(InviteDialogComponent, {
      width: '250px',
      data: {name: storyboardID}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('the dialog was closed');
      this.memberID = result;
      if (this.memberID != null) {
        console.log('you wrote something');
        this.userService.updateMember(storyboardID, this.memberID);
      } else {
        console.log('you left it empty');
      }
    });
  }

  openAddStoryboardDialog() {
    const dialogRef = this.dialog.open(AddStoryboardDialogComponent, {
      width: '250px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('the dialog was closed');
      const name: string = result;
      console.log(result);
      if (name != null) {
        this.userService.createStoryboard(name);
        this.reloadData();
      } else {
        console.log('you left it empty');
      }
    });
  }

  onSet(storyboardID: string) {
    this.userService.setCurrentStoryboard(storyboardID);
    this.reloadData();
  }

  reloadData() {
    this.eventSubscription.unsubscribe();
    setTimeout(() => {
      this.loadData();
    }, 1000);
  }

  onRemove(storyboardID: string) {
    this.userService.removeMember(storyboardID);
    this.reloadData();
  }
}

