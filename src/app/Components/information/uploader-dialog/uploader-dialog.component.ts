import { Component, OnInit } from '@angular/core';
import { UploadEvent, UploadFile, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import {AngularFireStorage, AngularFireUploadTask} from '@angular/fire/storage';
import {AngularFirestore} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {finalize} from 'rxjs/operators';
import {tap} from 'rxjs/internal/operators/tap';
import {UserDetails} from '../../../Shared/classes/user.model';
import {UserService} from '../../../Shared/services/user.service';
import {MatDialogRef} from '@angular/material';
import {InformationService} from '../../../Shared/services/information.service';
import {FileDetails} from '../information.component';

@Component({
  selector: 'app-uploader-dialog',
  templateUrl: './uploader-dialog.component.html',
  styleUrls: ['./uploader-dialog.component.css']
})
export class UploaderDialogComponent implements OnInit {
  public files: UploadFile[] = [];
  file: FileDetails = {
    name: '',
    downloadURL: '',
    path: '',
    id: ''
  }

  task: AngularFireUploadTask;

  percentage: Observable<number>;
  downloadURL;
  path;
  user: UserDetails;
  userSubscription;

  constructor(private storage: AngularFireStorage, public informationService: InformationService, private firestoreService: UserService, public dialogRef: MatDialogRef<UploaderDialogComponent>) { }

  ngOnInit() {
    this.firestoreService.getUserInformation();
    this.userSubscription = this.firestoreService.userChanged.subscribe(isUser => {
      this.user = isUser;
    });
  }

  onDrop(event: UploadEvent) {
    console.log(event);
    this.files = event.files;

    for (const droppedFile of event.files) {

      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {

          // begin upload
          this.startUpload(file);

        });
      } else {
        console.warn('invalid file');
      }
    }
  }

  startUpload(file: File) {
    const storyboard: string = this.user.currentStoryboard;
    const date = Date.now();
    this.file.name = file.name

    this.path = storyboard.concat('/' + date + '_' + this.file.name);
    this.file.path = this.path;

    // Reference to storage bucket
    const ref = this.storage.ref(this.path);

    // The main task
    this.task = this.storage.upload(this.path, file);

    // Progress monitoring
    this.percentage = this.task.percentageChanges();

    // Look for snapshot changes, once complete get download URL to store in firestore
    this.task.snapshotChanges().pipe( finalize(() => {
      this.downloadURL = ref.getDownloadURL();
      this.downloadURL.subscribe(url => {
        console.log(url);
        this.file.downloadURL = url.toString();
        this.informationService.addFile(this.user.currentStoryboard, this.file);
      });

    })
    ).subscribe();
  }


  onNoClick(): void {
    this.dialogRef.close();
  }

  onChange($event: Event) {
    const file = ($event.target as HTMLInputElement).files[0];

    this.startUpload(file);
  }
}
