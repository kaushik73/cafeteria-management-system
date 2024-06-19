// import { Menu } from "../models/Menu";
// import { Feedback } from "../models/Feedback";

import { Socket } from "socket.io";
import SocketService from "../services/SocketService";
import { Menu } from "../models/Menu";
import { recommendationService } from "./services/RecommendationService";

class RecommendationEngine {
  async generateNextDayRecommendation(callback: any) {
    try {
      const result =
        await recommendationService.generateNextDayRecommendation();
      //   const result = "test";
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
}
export const recommendationEngine = new RecommendationEngine();
