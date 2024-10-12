import {BehaviorSubject} from "rxjs";

export interface Model {
  heartRate?: number;
  restingHeartRate?: number;
  maxAboveRestMultiplier?: number;
  isAboveMax?: boolean;
}

const initialState: Model = {
    heartRate: 0,
    restingHeartRate: 80,
    maxAboveRestMultiplier: 1.25,
    isAboveMax: false
};

export const store = new BehaviorSubject<Model>(initialState);
