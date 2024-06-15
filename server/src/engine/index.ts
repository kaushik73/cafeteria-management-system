import { Menu } from "../models/Menu";
import { Feedback } from "../models/Feedback";

export class RecommendationAlgorithm {
  static getTopRatedItems(
    menuItems: Menu[],
    mealType: "breakfast" | "lunch" | "dinner"
  ): Menu[] {
    const limit = mealType === "breakfast" ? 3 : mealType === "lunch" ? 4 : 5;

    // Placeholder logic for selecting top-rated items.
    // Ideally, this should use real feedback data to compute ratings and select top items.
    return menuItems.sort((a, b) => 0.5 - Math.random()).slice(0, limit);
  }
}
