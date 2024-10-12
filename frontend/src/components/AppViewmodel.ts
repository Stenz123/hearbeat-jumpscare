import {Model, store} from "../features";
import {produce} from "immer";

export interface AppViewmodel {
  heartRate: number;
  restingHeartRate: number;
  maxHeartRate: number;
  color: string;
  isAboveMax: boolean
}

export function createAppViewmodel(model: Model): AppViewmodel {
  if (!model.isAboveMax && isAboveMax(model)) {
    let next = produce(store.getValue(), (draft) => {
      draft.isAboveMax = true;
    });
    store.next(next);
    console.log("Trigger");
  } else if (!isAboveMax(model)) {
    let next = produce(store.getValue(), (draft) => {
      draft.isAboveMax = false;
    });
    store.next(next);
  }

    return {
      heartRate: model.heartRates[model.heartRates.length - 1],
      restingHeartRate: model.restingHeartRate,
      color: mapValueToColor(model.heartRates[model.heartRates.length - 1], model.restingHeartRate, model.restingHeartRate * model.maxAboveRestMultiplier),
      isAboveMax: model.isAboveMax,
        maxHeartRate: Math.round(model.restingHeartRate * model.maxAboveRestMultiplier)
    };
  };

function mapValueToColor(value, min, max) {
  if (value < min) value = min;
  if (value > max) value = max;

  const normalizedValue = (value - min) / (max - min);

  const red = Math.floor(255 * normalizedValue);
  const green = Math.floor(255 * (1 - normalizedValue));
  const blue = 0;

  const rgbToHex = (r, g, b) => {
    const toHex = (c) => {
      const hex = c.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  return rgbToHex(red, green, blue);
}

function isAboveMax(model: Model) {
  return model.heartRates[model.heartRates.length - 1] > model.restingHeartRate * model.maxAboveRestMultiplier;
}

export function calibrateButtonClicked() {
  if (store.getValue().heartRates.length < 10) {
    alert("Not enough data to calibrate");
    return
  }
  let next = produce(store.getValue(), (draft) => {
    draft.restingHeartRate = Math.round(draft.heartRates.reduce((a, b) => a + b, 0) / draft.heartRates.length);
  });
  store.next(next);
}

export function resetButtonClicked() {
  let next = produce(store.getValue(), (draft) => {
    draft.restingHeartRate = 80
  });
  store.next(next);
}

export function sliderChanged(event: Event) {
  let next = produce(store.getValue(), (draft) => {

    draft.maxAboveRestMultiplier = mapValue(parseInt((event.target as HTMLInputElement).value))
  });
  store.next(next);
}

function mapValue(value: number): number {
  const x1 = 0, y1 = 1.5;
  const x2 = 100, y2 = 1.1;

  // Linear interpolation formula
  return y1 + ((value - x1) * (y2 - y1)) / (x2 - x1);
}