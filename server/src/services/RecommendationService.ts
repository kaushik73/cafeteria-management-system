import { sqlDBOperations } from "../database/operations/sqlDBOperations";
import { recommendationEngine } from "../engine";
import { MealType, Menu } from "../models/Menu";
import { Preference } from "../models/Preference";
import { Recommendation } from "../models/Recommendation";
import DateService from "./DateService";

export default class RecommendationService {
  static async voteForRecommendedFood(
    data: any,
    callback: (response: any) => void
  ) {
    try {
      const nextDay = DateService.getNthPreviousDate(-1);
      const today = DateService.getNthPreviousDate(0);

      const recommendedFood: Recommendation[] =
        await sqlDBOperations.runCustomQuery(
          `select * from Recommendation where rollout_to_employee = true and recommendation_date between '${today}' and '${nextDay}'`
        );

      callback({ message: recommendedFood });
    } catch (error) {
      callback({ message: "Error in vote For Recommended Food" });
      console.error("error in vote For Recommended Food", error);
    }
  }

  static async checkRecommendationsExist(
    mealType: MealType,
    recommendationDate: string
  ): Promise<boolean> {
    const recommendations = await sqlDBOperations.selectAll(
      "Recommendation",
      {
        meal_type: mealType,
        recommendation_date: recommendationDate,
      },
      {},
      { meal_type: "=", recommendation_date: ">" }
    );
    return recommendations.length > 0;
  }

  async generateNextDayRecommendations(
    mealType: "breakfast" | "lunch" | "dinner"
  ) {
    await recommendationEngine.generateNextDayRecommendations(mealType);
  }

  static async viewRecommendedFood(mealType: MealType) {
    try {
      const nextDay = DateService.getNthPreviousDate(-1);
      const today = DateService.getNthPreviousDate(0);
      const query = `select * from Recommendation where meal_type = '${mealType}' and recommendation_date between '${today}' and '${nextDay}'`;

      console.log(query, "query");
      const recommendedFood: Recommendation[] =
        await sqlDBOperations.runCustomQuery(query);
      console.log({ viewRecommendedFood: recommendedFood });
      return recommendedFood;
    } catch (error) {
      console.error("Error retrieving recommended food:", error);
      throw new Error("Error in viewRecommendedFood");
    }
  }

  //  ordered preference food for employee
  static async viewPreferenceRecommendedFood(data: any) {
    try {
      const userId = data.userId; // Assuming userId is passed in data
      const preferences = await this.getUserPreferences(userId);

      const nextDay = DateService.getNthPreviousDate(-1);
      const today = DateService.getNthPreviousDate(0);
      const query = `select * from Recommendation where rollout_to_employee = true and recommendation_date between '${today}' and '${nextDay}'`;

      console.log(query);
      const recommendedFood: Recommendation[] =
        await sqlDBOperations.runCustomQuery(query);
      console.log({ viewRecommendedFood: recommendedFood });

      const sortedRecommendedFood = await this.sortRecommendationsByPreferences(
        recommendedFood,
        preferences
      );
      return sortedRecommendedFood;
    } catch (error) {
      console.error("Error retrieving recommended food:", error);
      throw new Error("Error");
    }
  }

  private static async getUserPreferences(userId: number): Promise<Preference> {
    const preferences = await sqlDBOperations.selectOne("Preference", {
      user_id: userId,
    });
    if (!preferences) throw new Error("Preferences not found");
    return preferences as Preference;
  }

  private static async sortRecommendationsByPreferences(
    recommendations: Recommendation[],
    preferences: Preference
  ): Promise<Recommendation[]> {
    const recommendationsWithMenus = await Promise.all(
      recommendations.map(async (recommendation) => {
        const menu = await RecommendationService.getMenuById(
          recommendation.menu_id
        );
        return { ...recommendation, menu };
      })
    );

    return recommendationsWithMenus.sort((a, b) => {
      const scoreA = a.menu
        ? RecommendationService.calculatePreferenceScore(a.menu, preferences)
        : 0;
      const scoreB = b.menu
        ? RecommendationService.calculatePreferenceScore(b.menu, preferences)
        : 0;

      return scoreB - scoreA;
    });
  }

  private static async getMenuById(menuId: number): Promise<Menu> {
    const menu = await sqlDBOperations.selectOne("Menu", { menu_id: menuId });
    return menu as Menu;
  }

  private static calculatePreferenceScore(
    menu: Menu,
    preferences: Preference
  ): number {
    let score = 0;

    if (menu.dietary_type === preferences.dietary_preference) score += 1;
    if (menu.spice_type === preferences.spice_level) score += 1;
    if (menu.cuisine_type === preferences.cuisine_preference) score += 1;
    if (menu.sweet_tooth_type === preferences.sweet_tooth) score += 1;

    return score;
  }

  static async chefRollout(
    data: { [key: string]: number[] },
    callback: (response: any) => void
  ) {
    console.log(data);
    try {
      const updatedRecommendations: Recommendation[] = [];

      for (const mealType of Object.keys(data)) {
        const recommendationIds = data[mealType];

        for (const recommendationId of recommendationIds) {
          await sqlDBOperations.update(
            "Recommendation",
            { rollout_to_employee: true },
            { recommendation_id: recommendationId }
          );
        }
      }

      callback("Chef roll out Success");
    } catch (error) {
      console.error("Error in chefRollout:", error);
      callback("Chef Rolledout Failed");
    }
  }
}
