import { sqlDBOperations } from "../database/operations/sqlDBOperations";
import { Menu } from "../models/Menu";
import { engineRecommendationService } from "./services/EngineRecommendationService";
class RecommendationEngine {
  async generateNextDayRecommendations(
    mealType: "breakfast" | "lunch" | "dinner",
    callback: any
  ) {
    try {
      const result =
        await engineRecommendationService.generateNextDayRecommendations(
          mealType
        );

      callback(result);
      console.log("TEST - Daily recommendation generated successfully.");
    } catch (error) {
      callback({
        status: "error",
        message: "Error generating daily recommendation.",
      });
      console.error("TEST - Error generating daily recommendation:", error);
    }
  }
  async getNextDayRecommendations(
    mealType: "breakfast" | "lunch" | "dinner",
    callback: any
  ) {
    try {
      const getAll =
        await engineRecommendationService.getNextDayRecommendations(mealType);
      console.log(
        "TEST - Daily recommendation get successfully. - index",
        getAll.recommendations
      );
      callback(getAll.recommendations);
    } catch (error) {
      callback({
        status: "error",
        message: "Error getting daily recommendation.",
      });
      console.error("TEST - Error getting daily recommendation:", error);
    }
  }

  async setDiscardStatus() {
    try {
      const menuItems: Menu[] = (await sqlDBOperations.selectAll(
        "menu"
      )) as Menu[];
      const discardItems = await engineRecommendationService.setDiscardStatus(
        menuItems
      );
      return discardItems;
    } catch (error) {
      console.error("TEST - Error setting discard Items", error);
      throw new Error("Error setting discard Items");
    }
  }
}
export const recommendationEngine = new RecommendationEngine();
