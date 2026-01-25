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
