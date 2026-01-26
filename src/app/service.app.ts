import { Injectable, inject } from '@angular/core';
import { Firestore, doc, docData, updateDoc, collection, collectionData } from '@angular/fire/firestore';
import { Device } from './model.app';
import { map, Observable } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class AppService {
  firestore: Firestore = inject(Firestore);

  getDevice(deviceName: string){
    const docRef = doc(this.firestore, 'devices', deviceName);
    return docData(docRef) as Observable<Device>;
  }

  getWaterLeakLogs(deviceName: string){
    const collectionRef = collection(this.firestore, 'devices/' + deviceName + '/water_leak_log');
    return collectionData(collectionRef).pipe(map((docs) => {
      docs.forEach((doc: any) => {
        doc.time_stamp = this.convertToLocalDate(new Date(doc.time_stamp));
        doc.start_flow_time = this.convertToLocalDate(new Date(doc.start_flow_time));
        doc.end_flow_time = this.convertToLocalDate(new Date(doc.end_flow_time));
      });
      return docs;
    }));
  }

  updateDevice(valveStatus: boolean){
    const docRef = doc(this.firestore, 'devices', 'test_device_1');
    updateDoc(docRef, {"valve_status": valveStatus});

  }

  convertToLocalDate(date: Date) {

    //Time from microcontroller is in UTC-4
    var offset = 240;
	  var newDate = new Date(date.getTime() - offset*60*1000);
    
    const year = newDate.getFullYear();
    // getMonth() returns 0-11, so add 1 and pad
    const month = String(newDate.getMonth() + 1).padStart(2, '0'); 
    const day = String(newDate.getDate()).padStart(2, '0');
    const hours = String(newDate.getHours()).padStart(2, '0');
    const minutes = String(newDate.getMinutes()).padStart(2, '0');
    const seconds = String(newDate.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

  }

}