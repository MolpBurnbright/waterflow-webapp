import { Component, signal, effect, inject, OnInit, Signal, ChangeDetectorRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatSlideToggleModule } from "@angular/material/slide-toggle"
import { MatTableModule} from '@angular/material/table';
import { Observable } from 'rxjs';
import { AppService } from './service.app';
import { Device, WaterLeakLog } from './model.app';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    FormsModule,
    MatSlideToggleModule,
    MatTableModule,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})

export class App implements OnInit{

  protected readonly title = signal('waterflow-webapp');
  appService: AppService = inject(AppService);

  deviceName: string = "test_device_1";

  device: Signal<Device | undefined>;
  waterLeakSignal: Signal<WaterLeakLog[] | undefined>;

  valveStatus: boolean = false;
  
  waterLeakLogs: WaterLeakLog[] = [];
  columnsToDisplay = ['time_stamp', 'start_flow_time', 'end_flow_time'];
  
  updateCounter: number = 0;
  currLogCount: number = 0;

  constructor(private cdref: ChangeDetectorRef){

    this.device = toSignal(this.appService.getDevice(this.deviceName));
    effect(() => {
      this.valveStatus = this.device()?.valve_status ?? false;
    });

    this.waterLeakSignal = toSignal(this.appService.getWaterLeakLogs(this.deviceName) as Observable<WaterLeakLog[]>);
    effect(() => {

        this.waterLeakLogs = (this.waterLeakSignal() ?? []).sort((a, b) => (a.time_stamp < b.time_stamp ? 1 : -1));
        this.cdref.detectChanges();

        this.updateCounter++;

        if(this.updateCounter > 2){
          if(this.waterLeakLogs.length > this.currLogCount){
            alert("Water Leak Detected!\nValve has been CLOSED to prevent futher water loss.");
          }
        }
        
        this.currLogCount = this.waterLeakLogs.length;
    });
    
  }


  ngOnInit(): void {


  }


  onValveToggle(){

    this.appService.updateDevice(this.valveStatus);

  }
 

}