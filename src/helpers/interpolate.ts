import { WindsAloftAltitude } from "../models/WindsAloft";

export interface WindVector {
  height: number;
  speed: number;
  direction: number;
}

export function interpolateWindVectors(
  vector1: WindVector,
  vector2: WindVector,
  height: number
): WindVector {
  let { height: height1, speed: speed1, direction: direction1 } = vector1;
  let { height: height2, speed: speed2, direction: direction2 } = vector2;

  // Calculate the interpolation factor
  const factor = (height - height1) / (height2 - height1);

  // Interpolate direction
  let angularDifference = direction2 - direction1;
  if (angularDifference > 180) {
    angularDifference -= 360;
  } else if (angularDifference < -180) {
    angularDifference += 360;
  }

  if (Math.abs(angularDifference) <= 180) {
  } else {
    if (direction2 > direction1) {
      direction2 -= 360;
    } else {
      direction1 -= 360;
    }
  }

  // Calculate interpolated wind vector components
  const x1 = speed1 * Math.cos((direction1 * Math.PI) / 180);
  const y1 = speed1 * Math.sin((direction1 * Math.PI) / 180);
  const x2 = speed2 * Math.cos((direction2 * Math.PI) / 180);
  const y2 = speed2 * Math.sin((direction2 * Math.PI) / 180);
  const interpolatedX = x1 + factor * (x2 - x1);
  const interpolatedY = y1 + factor * (y2 - y1);

  // Calculate magnitude of the interpolated wind vector
  const interpolatedSpeed = Math.sqrt(
    interpolatedX * interpolatedX + interpolatedY * interpolatedY
  );

  // Calculate direction of the interpolated wind vector
  const interpolatedVectorDirection =
    (Math.atan2(interpolatedY, interpolatedX) * 180) / Math.PI;
  const interpolatedVectorDirectionPositive =
    (interpolatedVectorDirection + 360) % 360;

  // Return the interpolated wind vector object
  return {
    height,
    speed: interpolatedSpeed,
    direction: interpolatedVectorDirectionPositive,
  };
}

export function convertToInterpolator(
  windAltitude: WindsAloftAltitude
): WindVector {
  return {
    height: windAltitude.altitudeInM,
    speed: windAltitude.windSpeedInKph,
    direction: windAltitude.windDirectionInDeg,
  };
}

/**
 * @param altitudes Assumed to be sorted, lowest to highest
 */
export function findNormalizedAltitude(
  altitudeInM: number,
  altitudes: WindsAloftAltitude[]
): WindsAloftAltitude {
  for (let i = 0; i < altitudes.length; i++) {
    const altitude = altitudes[i];
    if (altitude.altitudeInM > altitudeInM) {
      if (!altitudes[i - 1]) return altitude;

      const { speed, direction } = interpolateWindVectors(
        convertToInterpolator(altitudes[i - 1]),
        convertToInterpolator(altitudes[i]),
        altitudeInM
      );

      return {
        altitudeInM,
        windDirectionInDeg: direction,
        temperatureInC: interpolate(
          altitudeInM,
          {
            value: altitudes[i - 1].temperatureInC,
            point: altitudes[i - 1].altitudeInM,
          },
          {
            value: altitudes[i].temperatureInC,
            point: altitudes[i].altitudeInM,
          }
        ),
        windSpeedInKph: speed,
      };
    }
  }

  return altitudes[altitudes.length - 1];
}

interface Value {
  point: number;
  value: number;
}

export default function interpolate(
  targetPoint: number,
  ...values: Value[]
): number {
  // Sort the values array based on the point property
  values.sort((a, b) => a.point - b.point);

  // Find the two values that surround the target point
  let lowerValue: Value | undefined;
  let upperValue: Value | undefined;

  for (const value of values) {
    if (value.point <= targetPoint) {
      lowerValue = value;
    } else {
      upperValue = value;
      break;
    }
  }

  // If no upper or lower value found, return NaN
  if (!lowerValue || !upperValue) {
    return NaN;
  }

  // Perform linear interpolation
  const lowerWeight =
    (upperValue.point - targetPoint) / (upperValue.point - lowerValue.point);
  const upperWeight = 1 - lowerWeight;

  const interpolatedValue =
    lowerValue.value * lowerWeight + upperValue.value * upperWeight;
  return interpolatedValue;
}