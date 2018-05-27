import { Routes } from '@angular/router';
import { Lab1Component } from './labs/lab1/lab1.component';
import { Lab2Component } from './labs/lab2/lab2.component';
import { Lab3Component } from './labs/lab3/lab3.component';
import { Lab4Component } from './labs/lab4/lab4.component';
import { Lab5Component } from './labs/lab5/lab5.component';
import { Lab6Component } from './labs/lab6/lab6.component';
import { Lab7Component } from './labs/lab7/lab7.component';
import { Lab8Component } from './labs/lab8/lab8.component';
import { Lab9Component } from './labs/lab9/lab9.component';

export const AppRoutes: Routes = [
    { path: '', pathMatch: 'full', component: Lab1Component },
    { path: 'lab1', component: Lab1Component },
    { path: 'lab2', component: Lab2Component },
    { path: 'lab3', component: Lab3Component },
    { path: 'lab4', component: Lab4Component },
    { path: 'lab5', component: Lab5Component },
    { path: 'lab6', component: Lab6Component },
    { path: 'lab7', component: Lab7Component },
    { path: 'lab8', component: Lab8Component },
    { path: 'lab9', component: Lab9Component }
];
