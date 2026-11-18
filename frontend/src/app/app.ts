
import { Component } from '@angular/core';
import { IonApp, IonContent, IonHeader, IonToolbar, IonTitle, IonButton } from '@ionic/angular';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    IonApp,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButton
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  title = 'Seguimiento de Retos';
}
