import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material';
import {Height, HeightDialogComponent} from './height-dialog/height-dialog.component';
import {FormGroup} from '@angular/forms';
import {MonitoringService} from '../../Shared/services/monitoring.service';
import {UserDetails} from '../../Shared/classes/user.model';
import {UserService} from '../../Shared/services/user.service';
import { Chart } from 'chart.js';
import {Weight, WeightDialogComponent} from './weight-dialog/weight-dialog.component';
import {Medication, MedicationDialogComponent} from './medication-dialog/medication-dialog.component';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {map} from 'rxjs/operators';
import {EditMedicationDialogComponent} from './edit-medication-dialog/edit-medication-dialog.component';

@Component({
  selector: 'app-monitoring',
  templateUrl: './monitoring.component.html',
  styleUrls: ['./monitoring.component.css']
})
export class MonitoringComponent implements OnInit, OnDestroy {
  @ViewChild('heightLineChart') private HeightChartRef;
  @ViewChild('weightLineChart') private WeightChartRef;
  heightChart: any;
  weightChart: any;
  heightForm: FormGroup;
  weightForm: FormGroup;
  medicationForm: FormGroup;
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
  height: Height = {
    height: 0,
    metric: '',
    date: '',
  };
  weight: Weight = {
    weight: 0,
    metric: '',
    date: '',
  };
  user: UserDetails;
  userSubscription;
  logSubscription;
  medicationSubscription;
  heightArray = [];
  weightArray = [];
  medicationArray = [];
  heightLabels = [];
  weightLabels = [];
  row;
  cols = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return 1;
      }
      return 2;
    })
  );

  constructor(public dialog: MatDialog,
              public monitoringService: MonitoringService,
              public firestoreService: UserService,
              private breakpointObserver: BreakpointObserver) {
  }

  ngOnInit() {
    this.loadAllLogs();
  }

  ngOnDestroy() {
    if (this.userSubscription != null && this.medicationSubscription != null) {
      this.userSubscription.unsubscribe();
      this.logSubscription.unsubscribe();
      this.medicationSubscription.unsubscribe();
    }

  }

  loadAllLogs() {
    this.userSubscription = this.firestoreService.userChanged.subscribe(isUser => {
      this.user = isUser;
    });

    setTimeout(() => {
      this.loadHeightLogs();
      this.loadWeightLogs();
      this.loadMedicationLogs();
      setTimeout(() => {
        this.makeHeightChart();
        this.makeWeightChart();
      }, 2000);
    }, 1000);
  }

  openHeightDialog(): void {
    const dialogRef = this.dialog.open(HeightDialogComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      this.heightForm = result;
      if (this.heightForm != null) {
        console.log(this.heightForm);
        this.createHeightLog(this.heightForm);
        this.reloadData();
      } else {
        console.log('you left it empty');
      }
    });

  }

  openWeightDialog() {
    const dialogRef = this.dialog.open(WeightDialogComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      this.weightForm = result;
      if (this.weightForm != null) {
        this.createWeightLog(this.weightForm);
        this.reloadData();
      } else {
        console.log('you left it empty');
      }
    });
  }

  openMedicationDialog() {
    const dialogRef = this.dialog.open(MedicationDialogComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      this.medicationForm = result;
      if (this.medicationForm != null) {
        console.log(this.medicationForm);
        this.createMedicationLog(this.medicationForm);
        this.reloadData();
      } else {
        console.log('you left it empty');
      }
    });
  }

  openEditMedicationDialog(medication: Medication) {
    const dialogRef = this.dialog.open(EditMedicationDialogComponent, {
      width: '500px',
      data: {
        name: medication.name,
        dosage: medication.dosage,
        instructions: medication.instructions,
        purpose: medication.purpose,
        expirationDate: medication.expirationDate,
        prescriptionDate: medication.prescriptionDate,
        prescribedBy: medication.prescribedBy,
        amount: medication.amount,
        id: medication.id
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      this.medication = result;
      if (this.medication != null) {
        this.monitoringService.editMedication(this.medication, this.user.currentStoryboard);
        this.reloadData();
      } else {
        console.log('you left it empty');
      }
    });
  }

  createHeightLog(heightForm: FormGroup) {
    this.height.metric = heightForm.get('metric').value.toString();
    this.height.date = heightForm.get('date');
    if (this.height.metric === 'ft,in') {
      const ft = heightForm.get('ft').value;
      const inch = heightForm.get('in').value;

      this.height.height = this.convertHeight(ft, inch);
      this.monitoringService.createHeightLog(this.height, this.user.currentStoryboard);

    } else {
      this.height.height = heightForm.get('cm').value;
      this.monitoringService.createHeightLog(this.height, this.user.currentStoryboard);
    }
  }

  createWeightLog(weightForm: FormGroup) {
    this.weight.metric = weightForm.get('metric').value.toString();
    this.weight.date = weightForm.get('date');
    if (this.weight.metric !== 'kg') {
      this.weight.weight = this.convertWeight(this.weight.metric, weightForm.get('weight').value);
      this.monitoringService.createWeightLog(this.weight, this.user.currentStoryboard);

    } else {
      console.log(weightForm.get('weight').value);
      this.weight.weight = weightForm.get('weight').value;
      this.monitoringService.createWeightLog(this.weight, this.user.currentStoryboard);
    }
  }

  createMedicationLog(medicationForm: FormGroup) {
    this.medication.name = medicationForm.get('medicationDetails.name').value.toString();
    this.medication.dosage = medicationForm.get('medicationDetails.dosage').value.toString();
    this.medication.instructions = medicationForm.get('information.instructions').value.toString();
    this.medication.expirationDate = medicationForm.get('information.expirationDate').value;
    this.medication.purpose = medicationForm.get('information.purpose').value.toString();
    this.medication.amount = medicationForm.get('prescriptionDetails.amount').value.toString();
    this.medication.prescribedBy = medicationForm.get('prescriptionDetails.prescribedBy').value.toString();
    this.medication.prescriptionDate = medicationForm.get('prescriptionDetails.prescriptionDate').value;
    this.monitoringService.createMedication(this.medication, this.user.currentStoryboard);
  }

  loadHeightLogs() {
    this.monitoringService.getHeightLog(this.user.currentStoryboard);
    const array = [];
    this.logSubscription = this.monitoringService.heightLogLoader.subscribe(isHeightLog => {
      array.push({x: isHeightLog.date.toDate(), y: isHeightLog.height});
      this.heightLabels.push(isHeightLog.date.toDate());
      this.heightArray = array;
    });
  }

  loadWeightLogs() {
    const array = [];
    this.monitoringService.getWeightLog(this.user.currentStoryboard);
    this.logSubscription = this.monitoringService.weightLogLoader.subscribe(isWeightLog => {
      array.push({x: isWeightLog.date.toDate(), y: isWeightLog.weight});
      this.weightLabels.push(isWeightLog.date.toDate());
    });
    this.weightArray = array;
  }

  loadMedicationLogs() {
    const array = [];
    this.monitoringService.getMedication(this.user.currentStoryboard);
    this.medicationSubscription = this.monitoringService.medicationLoader.subscribe( isMedication => {
      array.push({
        name: isMedication.name,
        dosage: isMedication.dosage,
        instructions: isMedication.instructions,
        expirationDate: isMedication.expirationDate.toDate(),
        purpose: isMedication.purpose,
        amount: isMedication.amount,
        prescribedBy: isMedication.prescribedBy,
        prescriptionDate: isMedication.prescriptionDate.toDate(),
        id: isMedication.id
      });
    });
    this.medicationArray = array;
  }

  convertHeight(feet: number, inch: number) {
    const height = (feet + (inch / 10));
    return Math.round((height / 3.2808) * 100);
  }

  convertWeight(metric: string, weight: number) {
    if (metric === 'stone') {
      return (weight / 0.15747);
    } else if (metric === 'lbs') {
      return (weight * 0.45359237);
    }
  }

  makeHeightChart() {
    this.heightChart = new Chart(this.HeightChartRef.nativeElement, {
      type: 'line',
      labels: this.heightLabels,
      data: {
        datasets: [
          {data: this.heightArray}]
      },
      options: {
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            display: true,
            type: 'time',
            time: {
              unit: 'month'
            },
            scaleLabel: {
              display: true,
              labelString: 'Date logged'
            }
          }],
          yAxes: [{
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Height in (cm)'
            }
          }],
        }
      }
    });
  }

  makeWeightChart() {
    this.weightChart = new Chart(this.WeightChartRef.nativeElement, {
      type: 'line',
      labels: this.weightLabels,
      data: {
        datasets: [
          {data: this.weightArray}]
      },
      options: {
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            display: true,
            type: 'time',
            time: {
              unit: 'month'
            },
            scaleLabel: {
              display: true,
              labelString: 'Date logged'
            }
          }],
          yAxes: [{
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Weight in (kg)'
            }
          }],
        }
      }
    });
  }


  deleteMedication(medicationID: string) {
    this.monitoringService.deleteMedication(medicationID, this.user.currentStoryboard);
    this.reloadData();
  }

  reloadData() {
    this.userSubscription.unsubscribe();
    this.logSubscription.unsubscribe();
    this.medicationSubscription.unsubscribe();
    setTimeout(() => {
      this.loadAllLogs();
    }, 1000);
  }


}


