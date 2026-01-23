import { Component, ChangeDetectorRef, signal, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Firestore, doc, docData, updateDoc } from '@angular/fire/firestore';
import { getToken, onMessage} from "firebase/messaging";
import { Messaging } from '@angular/fire/messaging';
import { FormsModule } from '@angular/forms';
import { MatSlideToggleModule } from "@angular/material/slide-toggle"
import { environment } from '../environment';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    FormsModule,
    MatSlideToggleModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit{
  protected readonly title = signal('waterflow-webapp');

  firestore: Firestore = inject(Firestore);
  messaging: Messaging = inject(Messaging);

  device: any;
  messageCount: number = 0;

  constructor(private cdr: ChangeDetectorRef){

    const docRef = doc(this.firestore, 'devices', 'test_device_1');
    docData(docRef).subscribe(data => {
        this.device = data;
        cdr.detectChanges();
    });


  }

  ngOnInit(): void {


    this.requestPermission();

    onMessage(this.messaging, (payload) => {
      alert(JSON.stringify(payload));
      // ...
    });
  }


  onValveToggle(){
    const docRef = doc(this.firestore, 'devices', 'test_device_1');
    updateDoc(docRef, {"valve_status": this.device.valve_status});
  }
 
  requestPermission() {
    console.log('Requesting permission...');
    Notification.requestPermission().then((permission) => {
    if (permission === 'granted') {
      console.log('Notification permission granted.');
      getToken(this.messaging, {
       vapidKey: environment.vapidKey,
        })
            .then((currentToken: string) => {
            if (currentToken) {
                console.log(currentToken);
            } else {
                console.log(
                'No registration token available. Request permission to generate one.'
                );
            }
            })
            .catch((err: any) => {
            console.log(err);
            });
        }
    });
  }

}
