import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherIconComponent } from './weather-icons.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    WeatherIconComponent
  ],
  exports: [
    WeatherIconComponent
  ]
})
export class WeatherIconsModule { } 