import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';


import { AppComponent } from './app.component';
import { Lab1Component } from './labs/lab1/lab1.component';
import { Lab2Component } from './labs/lab2/lab2.component';
import { AppRoutes } from './app.routes';
import { Lab3Component } from './labs/lab3/lab3.component';
import { FormsModule } from '@angular/forms';
import { Lab4Component } from './labs/lab4/lab4.component';
import { Lab5Component } from './labs/lab5/lab5.component';
import { Lab6Component } from './labs/lab6/lab6.component';
import { Lab7Component } from './labs/lab7/lab7.component';
import { Lab8Component } from './labs/lab8/lab8.component';
import { Lab9Component } from './labs/lab9/lab9.component'

@NgModule({
  declarations: [
    AppComponent,
    Lab1Component,
    Lab2Component,
    Lab3Component,
    Lab4Component,
    Lab5Component,
    Lab6Component,
    Lab7Component,
    Lab8Component,
    Lab9Component
  ],
  imports: [
    RouterModule.forRoot(AppRoutes),
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
