import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material';
import {UploaderDialogComponent} from './uploader-dialog/uploader-dialog.component';
import {InformationService} from '../../Shared/services/information.service';
import {UserService} from '../../Shared/services/user.service';
import {UserDetails} from '../../Shared/classes/user.model';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {map} from 'rxjs/operators';

export interface FileDetails {
  name: string;
  downloadURL: string;
  path: string;
  id: string;
}

@Component({
  selector: 'app-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.css']
})
export class InformationComponent implements OnInit, OnDestroy {
  constructor(public dialog: MatDialog,
              public informationService: InformationService,
              public firestoreService: UserService,
              private breakpointObserver: BreakpointObserver) { }
  fileArray = [];
  fileSubscription;
  userSubscription;
  user: UserDetails;
  file: FileDetails = {
    name: '',
    downloadURL: '',
    path: '',
    id: ''
  };
  cols = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return 1;
      }
      return 2;
    })
  );

  ngOnInit() {
    this.userSubscription = this.firestoreService.userChanged.subscribe( isUser => {
      this.user = isUser;
    });
    setTimeout(() => {
      this.loadInformation();
    }, 1000);
  }

   ngOnDestroy() {
    this.userSubscription.unsubscribe();
    this.fileSubscription.unsubscribe();
   }

  openAddFileDialog() {
    const dialogRef = this.dialog.open(UploaderDialogComponent, {
      width: '500px',
    });


    dialogRef.afterClosed().subscribe(() => {
      this.reloadData();
    });
  }

  onDelete(filePath: string, fileID: string) {
    this.informationService.deleteFile(filePath, this.user.currentStoryboard, fileID );
    this.reloadData();
  }

  reloadData() {
    this.fileSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
    this.loadInformation();
  }

  loadInformation() {
    const array = [];
    this.informationService.getFile(this.user.currentStoryboard);
    this.fileSubscription = this.informationService.fileLoader.subscribe ( isFile => {
      array.push({
        name: isFile.name,
        path: isFile.path,
        downloadURL: isFile.downloadURL,
        id: isFile.id
      });
    });
    this.fileArray = array;
  }

}
