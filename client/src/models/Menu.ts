export interface Menu {
  menu_id: number;
  item_name: string;
  price: number;
  availability_status: boolean;
  meal_type: "lunch" | "dinner" | "breakfast";
  dietary_type: "vegetarian" | "non-vegetarian" | "eggetarian";
  spice_type: "high" | "medium" | "low";
  cuisine_type: "north-indian" | "south-indian" | "other";
  sweet_tooth_type: boolean;
  is_discard: boolean | null;
}

export type MealType = "breakfast" | "lunch" | "dinner";
export type DietaryType = "vegetarian" | "non-vegetarian" | "eggetarian";
export type SpiceType = "high" | "medium" | "low";
export type CuisineType = "north-indian" | "south-indian" | "other";

export const allowedMealTypes: MealType[] = ["breakfast", "lunch", "dinner"];
export const allowedDietaryTypes: DietaryType[] = [
  "vegetarian",
  "non-vegetarian",
  "eggetarian",
];
export const allowedSpicyTypes: SpiceType[] = ["high", "medium", "low"];
export const allowedCuisineTypes: CuisineType[] = [
  "north-indian",
  "south-indian",
  "other",
];
