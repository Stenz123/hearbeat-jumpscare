import {Model, store} from "../features";
import {produce} from "immer";

export interface AppViewmodel {
  heartRate: number;
  restingHeartRate: number;
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
      heartRate: model.heartRate,
      restingHeartRate: model.restingHeartRate,
      color: mapValueToColor(model.heartRate, model.restingHeartRate, model.restingHeartRate * model.maxAboveRestMultiplier),
      isAboveMax: model.isAboveMax
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
  return model.heartRate > model.restingHeartRate * model.maxAboveRestMultiplier;
}

