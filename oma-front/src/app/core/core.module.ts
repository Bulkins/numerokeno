import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CoreRoutingModule } from './core-routing.module';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    CoreRoutingModule,
    HttpClientModule
  ],
  declarations: [],
  exports: [
    CommonModule,
    RouterModule
  ]
})
export class CoreModule { }
