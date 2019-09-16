import {EventEmitter, Injectable, Output} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {Height} from '../../Components/monitoring/height-dialog/height-dialog.component';
import {Weight} from '../../Components/monitoring/weight-dialog/weight-dialog.component';
import {Medication} from '../../Components/monitoring/medication-dialog/medication-dialog.component';
import {Goal} from '../../Components/goal/goal.component';


@Injectable({
  providedIn: 'root'
})
export class MonitoringService {
  height: Height = {
    height: 0,
    date: '',
    metric: 'cm'
  };
  weight: Weight = {
    weight: 0,
    date: '',
    metric: 'kg'
  };
  medication: Medication = {
    name: '',
    dosage: '',
    instructions: '',
    purpose: '',
    expirationDate: '',
    prescriptionDate: '',
    prescribedBy: '',
    amount: '',
    id: ''
  };

  @Output() heightLogLoader: EventEmitter<any> = new EventEmitter();
  @Output() weightLogLoader: EventEmitter<any> = new EventEmitter();
  @Output() medicationLoader: EventEmitter<any> = new EventEmitter();

  constructor(public db: AngularFirestore) { }

  createHeightLog(height: Height, currentStoryboard: string) {
    this.db.collection('monitoring').doc(currentStoryboard)
      .collection('height').add({
      height: height.height.toString(),
      date: height.date.value
    });
  }

  createWeightLog(weight: Weight, currentStoryboard: string) {
    this.db.collection('monitoring').doc(currentStoryboard)
      .collection('weight').add({
      weight: weight.weight.toString(),
      date: weight.date.value
    });
  }

  createMedication(medication: Medication, currentStoryboard: string) {
    this.db.collection('monitoring').doc(currentStoryboard)
      .collection('medications').add({
      name: medication.name,
      dosage: medication.dosage,
      instructions: medication.instructions,
      expirationDate: medication.expirationDate,
      amount: medication.amount,
      purpose: medication.purpose,
      prescribedBy: medication.prescribedBy,
      prescriptionDate: medication.prescriptionDate
    });
  }

  getHeightLog(currentStoryboard: string) {
    this.db.collection('monitoring').doc(currentStoryboard).
    collection('height').ref.get().then(data => {
      data.forEach( doc => {
        this.height.height = doc.data().height;
        this.height.date = doc.data().date;
        this.heightLogLoader.emit(this.height);
      });
    });
  }

  getWeightLog(currentStoryboard: string) {
    this.db.collection('monitoring').doc(currentStoryboard).
    collection('weight').ref.get().then(data => {
      data.forEach( doc => {
        this.weight.weight = doc.data().weight;
        this.weight.date = doc.data().date;
        this.weightLogLoader.emit(this.weight);
      });
    });
  }

  getMedication(currentStoryboard: string) {
    this.db.collection('monitoring').doc(currentStoryboard).
    collection('medications').ref.get().then(data => {
      data.forEach( doc => {
        this.medication.name = doc.data().name;
        this.medication.dosage = doc.data().dosage;
        this.medication.instructions = doc.data().instructions;
        this.medication.purpose = doc.data().purpose;
        this.medication.amount = doc.data().amount;
        this.medication.expirationDate = doc.data().expirationDate;
        this.medication.prescribedBy = doc.data().prescribedBy;
        this.medication.prescriptionDate = doc.data().prescriptionDate;
        this.medication.id = doc.id;
        this.medicationLoader.emit(this.medication);
      });
    });
  }

  deleteMedication(medicationID: string, currentStoryboard: string) {
    this.db.collection('monitoring').doc(currentStoryboard)
      .collection('medications').doc(medicationID).delete();
  }

  editMedication(medication: Medication, currentStoryboard: string) {
    this.db.collection('monitoring').doc(currentStoryboard)
      .collection('medications').doc(medication.id).update({
      name: medication.name,
      dosage: medication.dosage,
      instructions: medication.instructions,
      purpose: medication.purpose,
      expirationDate: medication.expirationDate,
      prescriptionDate: medication.prescriptionDate,
      prescribedBy: medication.prescribedBy,
      amount: medication.amount,
      id: medication.id,
    });
  }
}
