import { Menu } from "../../models/Menu";
import { Feedback } from "../../models/Feedback";
import { Recommendation } from "../../models/Recommendation";
import { sqlDBOperations } from "../../database/operations/sqlDBOperations";
import { engineSentimentAnalysisService } from "./EngineSentimentAnalysisService";
import DateService from "../../services/DateService";
import { defaultItemValues, mealTypeLimit } from "../../common/contants";
import { engineFeedbackService } from "./EngineFeedbackService";
import { engineMenuService } from "./EngineMenuService";
// import FeedbackService from "../../services/FeedbackService";
// import MenuService from "../../services/MenuService";

class EngineRecommendationService {
  async generateNextDayRecommendations(
    mealType: "breakfast" | "lunch" | "dinner"
  ): Promise<Object> {
    console.log(
      `Starting to generate next day recommendations for ${mealType}`
    );
    try {
      const nextDay = DateService.getNthPreviousDate(-1);
      console.log(`Retrieved next day: ${nextDay}`);

      const numberOfRecommendations = this.getNumberOfRecommendations(mealType);
      console.log(
        `Number of recommendations for ${mealType}: ${numberOfRecommendations}`
      );

      const topRatedItems = await engineMenuService.getTopRatedMenuItems(
        mealType,
        numberOfRecommendations
      );
      console.log(`Top rated items for ${mealType}:`, topRatedItems);

      const recommendations = await this.createRecommendations(
        topRatedItems,
        mealType,
        nextDay
      );
      console.log(`Created recommendations for ${mealType}:`, recommendations);

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
        console.log(`Feedbacks for menu item ${item.menu_id}:`, feedbacks);

        const averageRating = this.calculateAverageRating(feedbacks);
        console.log(
          `Average rating for menu item ${item.menu_id}: ${averageRating}`
        );

        const averageSentiment =
          await engineSentimentAnalysisService.calculateAverageSentiment(
            feedbacks
          );
        console.log(
          `Average sentiment for menu item ${item.menu_id}: ${averageSentiment}`
        );

        const recommendation = await this.saveRecommendation(
          item.menu_id,
          mealType,
          recommendationDate,
          averageRating,
          averageSentiment
        );
        console.log(
          `Saved recommendation for menu item ${item.menu_id}:`,
          recommendation
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

  // async getNextDayRecommendations(mealType: "breakfast" | "lunch" | "dinner") {
  //   const nextDay = DateService.getNthPreviousDate(-1);
  //   const today = DateService.getNthPreviousDate(0);

  //   const recommendations = await sqlDBOperations.runCustomQuery(
  //     `select * from Recommendation where meal_type = '${mealType}' and recommendation_date between '${today}' and '${nextDay}'`
  //   );
  //   console.log("recommendations", recommendations);

  //   return {
  //     status: "success",
  //     message: `Next day recommendations for ${mealType} retrieved successfully.`,
  //     recommendations: recommendations,
  //   };
  // }

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
        console.log(
          "Testing - setDiscardStatus",
          menuItem.item_name,
          averageRating,
          averageSentiment
        );

        if (
          averageRating < defaultItemValues.discard_item_rating_limit ||
          averageSentiment < defaultItemValues.discard_item_feedback_limit
        ) {
          // itemsToDiscard.push(menuItem);
          await sqlDBOperations.update(
            "Menu",
            { is_discard: true },
            { menu_id: menuItem.menu_id }
          );
        }
      }

      console.log("Discard status updated successfully.");
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
