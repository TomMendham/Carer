import {
  MatButtonModule, MatButtonToggleModule, MatCardModule,
  MatCheckboxModule, MatDatepickerModule, MatDialogModule, MatExpansionModule, MatFormFieldModule, MatGridListModule,
  MatIconModule, MatInputModule,
  MatListModule,
  MatMenuModule, MatNativeDateModule, MatOptionModule, MatProgressBarModule, MatProgressSpinnerModule, MatSelectModule, MatStepperModule,
  MatTableModule,
  MatToolbarModule, MatTooltipModule
} from '@angular/material';

import {NgModule} from '@angular/core';


@NgModule({
  imports: [
    MatButtonModule,
    MatCheckboxModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatListModule,
    MatTableModule,
    MatOptionModule,
    MatSelectModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatStepperModule,
    MatDialogModule,
    MatTooltipModule,
    MatButtonToggleModule,
    MatGridListModule,
    MatProgressBarModule,
    MatTableModule,
    MatExpansionModule
  ],
  exports: [
    MatButtonModule,
    MatCheckboxModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatListModule,
    MatTableModule,
    MatSelectModule,
    MatOptionModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatStepperModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatButtonToggleModule,
    MatGridListModule,
    MatProgressBarModule,
    MatTableModule,
    MatExpansionModule
  ]
})

export class MaterialModule {}
