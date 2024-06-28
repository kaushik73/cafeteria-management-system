import { Menu } from "../../models/Menu";
import { Feedback } from "../../models/Feedback";
import { Recommendation } from "../../models/Recommendation";
import { sqlDBOperations } from "../../database/operations/sqlDBOperations";
import { engineSentimentAnalysisService } from "./EngineSentimentAnalysisService";
import DateService from "../../services/DateService";
import { defaultItemValues, mealTypeLimit } from "../../common/contants";
import { engineFeedbackService } from "./EngineFeedbackService";
import { engineMenuService } from "./EngineMenuService";

class EngineRecommendationService {
  async generateNextDayRecommendations(
    mealType: "breakfast" | "lunch" | "dinner"
  ): Promise<Object> {
    try {
      const nextDay = DateService.getNthPreviousDate(-1);

      const numberOfRecommendations = this.getNumberOfRecommendations(mealType);

      const topRatedItems = await engineMenuService.getTopRatedMenuItems(
        mealType,
        numberOfRecommendations
      );

      const recommendations = await this.createRecommendations(
        topRatedItems,
        mealType,
        nextDay
      );
      return {
        status: "success",
        message: `Next day recommendations for ${mealType} generated successfully.`,
        recommendations: recommendations,
      };
    } catch (error) {
      console.error(
        `Error generating next day recommendation for ${mealType}:`,
        error
      );
      return {
        status: "error",
        message: `Error generating next day recommendation for ${mealType}.`,
      };
    }
  }

  private async createRecommendations(
    menuItems: Menu[],
    mealType: string,
    recommendationDate: string
  ): Promise<Recommendation[]> {
    const recommendations = await Promise.all(
      menuItems.map(async (item) => {
        const feedbacks = await engineFeedbackService.getFeedbackForMenu(
          item.menu_id
        );
        const averageRating = this.calculateAverageRating(feedbacks);
        const averageSentiment =
          await engineSentimentAnalysisService.calculateAverageSentiment(
            feedbacks
          );
        const recommendation = await this.saveRecommendation(
          item.menu_id,
          mealType,
          recommendationDate,
          averageRating,
          averageSentiment
        );
        return recommendation;
      })
    );

    return recommendations;
  }

  private async saveRecommendation(
    menuId: number,
    mealType: string,
    recommendationDate: string,
    averageRating: number,
    averageSentiment: number
  ): Promise<Recommendation> {
    const recommendation = {
      meal_type: mealType as "lunch" | "breakfast" | "dinner",
      recommendation_date: recommendationDate as unknown as Date,
      average_rating: averageRating,
      rollout_to_employee: null, // set by chef later
      average_sentiment: averageSentiment,
      menu_id: menuId,
    };
    const result = await sqlDBOperations.insert(
      "Recommendation",
      recommendation
    );
    if (!result) throw new Error("Failed to insert recommendation");
    return result;
  }

  async setDiscardStatus(menuItems: Menu[]): Promise<void> {
    try {
      for (const menuItem of menuItems) {
        const feedbacks = await engineFeedbackService.getFeedbackForMenu(
          menuItem.menu_id
        );
        const averageRating = this.calculateAverageRating(feedbacks);
        const averageSentiment =
          await engineSentimentAnalysisService.calculateAverageSentiment(
            feedbacks
          );
        if (
          averageRating < defaultItemValues.discard_item_rating_limit &&
          averageSentiment < defaultItemValues.discard_item_feedback_limit
        ) {
          await sqlDBOperations.update(
            "Menu",
            { is_discard: true },
            { menu_id: menuItem.menu_id }
          );
        }
      }
    } catch (error) {
      console.error("Error setting discard status:", error);
      throw new Error("Error setting discard status.");
    }
  }

  private calculateAverageRating(feedbacks: Feedback[]): number {
    const totalRating = feedbacks.reduce(
      (sum, feedback) => sum + feedback.rating,
      0
    );
    return totalRating / feedbacks.length;
  }

  private getNumberOfRecommendations(
    mealType: "breakfast" | "lunch" | "dinner"
  ): number {
    if (mealType == "breakfast") {
      return mealTypeLimit.breakfast_limit;
    } else if (mealType == "lunch") {
      return mealTypeLimit.lunch_limit;
    } else if (mealType == "dinner") {
      return mealTypeLimit.dinner_limit;
    } else {
      return 0;
    }
  }
}

export const engineRecommendationService = new EngineRecommendationService();
