import { recommendationService } from "./services/RecommendationService";
class RecommendationEngine {
  async generateNextDayRecommendation(callback: any) {
    try {
      const result =
        await recommendationService.generateNextDayRecommendation();

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
  async getNextDayRecommendations(callback: any) {
    try {
      const getAll = await recommendationService.getNextDayRecommendations();
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
}
export const recommendationEngine = new RecommendationEngine();
