import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private alertSubject = new Subject<Alert>();

  // Observable for components to subscribe to
  alert$ = this.alertSubject.asObservable();

  // Method to emit an alert
  showAlert(alert: Alert) {
    this.alertSubject.next(alert);
  }

}



export interface Alert {
  type: string;
  message: string;
  object_id: string | number
}
