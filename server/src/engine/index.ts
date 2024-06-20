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
  async getNextDayRecommendation(callback: any) {
    try {
      const getAll = await recommendationService.getNextDayRecommendations();
      //   const result = "test";
      callback(getAll);
      console.log("TEST - Daily recommendation get successfully.");
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
