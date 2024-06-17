import { MealTypes } from "../../../server/src/models/Menu";

export const allowedMealTypes: MealTypes[keyof MealTypes][] = [
  "lunch",
  "dinner",
  "breakfast",
];

export function validateMealType(input: string): boolean {
  return allowedMealTypes.includes(input as MealTypes[keyof MealTypes]);
  // Alternatively, using the enum
  // return Object.values(MealTypeEnum).includes(input as MealTypeEnum);
}

export function validateItemName(input: string): boolean {
  return input.trim().length > 0;
}
// Function to validate price
export function validatePrice(input: string): boolean {
  const price = parseFloat(input);
  return !isNaN(price) && price > 0;
}

// Function to validate availability status
export function validateAvailabilityStatus(input: string): boolean {
  return input.toLowerCase() === "yes" || input.toLowerCase() === "no";
}

// Function to validate item ID
export function validateMenuID(input: string): boolean {
  const id = parseInt(input);
  return !isNaN(id) && id > 0;
}

// Function to validate description
export function validateDescription(input: string): boolean {
  return input.trim().length > 0;
}

// Function to validate category
export function validateCategory(input: string): boolean {
  return input.trim().length > 0;
}

// Function to validate notification message
export function validateNotificationMessage(input: string): boolean {
  return input.trim().length > 0;
}
