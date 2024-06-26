import { sqlDBOperations } from "../database/operations/sqlDBOperations";
import { Menu } from "../models/Menu";
import { engineRecommendationService } from "./services/EngineRecommendationService";
class RecommendationEngine {
  async generateNextDayRecommendations(
    mealType: "breakfast" | "lunch" | "dinner"
    // callback: any
  ) {
    try {
      const result =
        await engineRecommendationService.generateNextDayRecommendations(
          mealType
        );

      console.log("TEST - generate", result);

      return result;
    } catch (error) {
      return "Error generating daily recommendation.";
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
