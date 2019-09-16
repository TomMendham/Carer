import {EventEmitter, Injectable, Output} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {FileDetails} from '../../Components/information/information.component';
import {AngularFireStorage} from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class InformationService {
  @Output() fileLoader: EventEmitter<any> = new EventEmitter();
  file: FileDetails = {
    name: '',
    downloadURL: '',
    path: '',
    id: ''
  }

  constructor(private db: AngularFirestore, private storage: AngularFireStorage) { }

  addFile(currentStoryboard: string, file: FileDetails) {
    this.db.collection('files').doc(currentStoryboard).ref.collection('files').add({
      name: file.name,
      downloadURL: file.downloadURL,
      path: file.path,
    });
  }

  getFile(currentStoryboard: string) {
    this.db.collection('files').doc(currentStoryboard)
      .collection('files').ref.get().then(data => {
      data.forEach(doc => {
        this.file.name = doc.data().name;
        this.file.path = doc.data().path;
        this.file.downloadURL = doc.data().downloadURL;
        this.file.id = doc.id;
        this.fileLoader.emit(this.file);
      });
    });
  }

  deleteFile(path: string, currentStoryboard: string, id: string) {
    console.log(currentStoryboard);
    console.log(id);
    this.storage.ref(path).delete();
    this.db.collection('files').doc(currentStoryboard)
      .collection('files').doc(id).delete();
  }
}

