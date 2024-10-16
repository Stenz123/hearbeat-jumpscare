import {BehaviorSubject} from "rxjs";

export interface Model {
  heartRates?: number[];
  restingHeartRate?: number;
  maxAboveRestMultiplier?: number;
  isAboveMax?: boolean;
}

const initialState: Model = {
    heartRates: [0],
    restingHeartRate: 80,
    maxAboveRestMultiplier: 1.25,
    isAboveMax: false
};

export const store = new BehaviorSubject<Model>(initialState);
