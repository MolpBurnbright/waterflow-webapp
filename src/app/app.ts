import { Component, ChangeDetectorRef, signal, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Firestore, doc, docData, updateDoc, collection, collectionData } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { MatSlideToggleModule } from "@angular/material/slide-toggle"
import { MatTableDataSource, MatTableModule} from '@angular/material/table';
import { Observable, map } from 'rxjs';
import { AsyncPipe } from '@angular/common';

export interface Device{
  name: string;
  total_consumption: number;
  valve_status: boolean;
}

export interface WaterLeakLog{
  time_stamp: string;
  start_flow_time: string;
  end_flow_time: string;
}

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    FormsModule,
    MatSlideToggleModule,
    MatTableModule,
    AsyncPipe
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit{
  protected readonly title = signal('waterflow-webapp');

  deviceName: string = 'test_device_1'

  firestore: Firestore = inject(Firestore);

  device$: Observable<Device>;

  datasource = new MatTableDataSource<WaterLeakLog>();
  waterLeakLogs$: Observable<MatTableDataSource<WaterLeakLog>>;

  valveStatus: boolean = false;
  messageCount: number = 0;
  
  constructor(){

    const docRef = doc(this.firestore, 'devices', this.deviceName);
    this.device$ = docData(docRef) as Observable<Device>;
    
    const collectionRef = collection(this.firestore, 'devices/' + this.deviceName + '/water_leak_log');
    this.waterLeakLogs$ = collectionData(collectionRef).pipe(map(data => {
      const datasource = this.datasource;
      datasource.data = data as WaterLeakLog[];
      console.log(datasource.data);
      return datasource as MatTableDataSource<WaterLeakLog>;
    }));
    
    this.device$.subscribe(data => {
      this.valveStatus = data.valve_status;
    });


  }


  ngOnInit(): void {


  }


  onValveToggle(){

    const docRef = doc(this.firestore, 'devices', 'test_device_1');
    updateDoc(docRef, {"valve_status": this.valveStatus});

  }
 

}