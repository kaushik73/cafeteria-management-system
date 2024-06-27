// import { MealTypes } from "../../../server/src/models/Menu";
import {
  CuisineType,
  DietaryType,
  MealType,
  SpiceType,
  allowedCuisineTypes,
  allowedDietaryTypes,
  allowedMealTypes,
  allowedSpicyTypes,
} from "../models/Menu";

export function validateMealType(input: string): boolean {
  return allowedMealTypes.includes(input as MealType);
}
export function validateDietaryType(input: string): boolean {
  return allowedDietaryTypes.includes(input as DietaryType);
}
export function validateSpiceType(input: string): boolean {
  return allowedSpicyTypes.includes(input as SpiceType);
}
export function validateCuisineType(input: string): boolean {
  return allowedCuisineTypes.includes(input as CuisineType);
}

export function validateInputLength(input: string): boolean {
  return input.trim().length > 0;
}
export function validatePrice(input: string): boolean {
  const price = parseFloat(input);
  return !isNaN(price) && price > 0;
}

export function validateBoolean(input: string): boolean {
  return input.toLowerCase() === "yes" || input.toLowerCase() === "no";
}

export function validateMenuID(input: string): boolean {
  const id = parseInt(input);
  return !isNaN(id) && id > 0;
}

// export function validateDescription(input: string): boolean {
//   return input.trim().length > 0;
// }

// export function validateCategory(input: string): boolean {
//   return input.trim().length > 0;
// }

// export function validateNotificationMessage(input: string): boolean {
//   return input.trim().length > 0;
// }
