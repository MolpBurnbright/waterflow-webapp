import { Injectable, inject } from '@angular/core';
import { Firestore, doc, docData, updateDoc, collection, collectionData } from '@angular/fire/firestore';
import { Device } from './model.app';
import { Observable } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class AppService {
  firestore: Firestore = inject(Firestore);

  getDevice(deviceName: string){
    const docRef = doc(this.firestore, 'devices', deviceName);
    return docData(docRef) as Observable<Device>;
  }

  getWaterLeakLogs(deviceName: string){
    const collectionRef = collection(this.firestore, 'devices/' + deviceName + '/water_leak_log');
    return collectionData(collectionRef);
  }

  updateDevice(valveStatus: boolean){
    const docRef = doc(this.firestore, 'devices', 'test_device_1');
    updateDoc(docRef, {"valve_status": valveStatus});

  }

}