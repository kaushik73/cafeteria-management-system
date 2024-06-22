import { Menu } from "../../models/Menu";
import { Feedback } from "../../models/Feedback";
import { Recommendation } from "../../models/Recommendation";
import { sqlDBOperations } from "../../database/operations/sqlDBOperations";
import { sentimentAnalysisService } from "./SentimentAnalysisService";
import DateService from "../../services/DateService";
import { mealTypeLimit } from "../../common/contants";
import FeedbackService from "../../services/FeedbackService";
import MenuService from "../../services/MenuService";

class RecommendationService {
  async generateNextDayRecommendation(): Promise<Object> {
    try {
      const nextDay = DateService.getNthPreviousDate(-1);
      const mealTypes: ("breakfast" | "lunch" | "dinner")[] = [
        "breakfast",
        "lunch",
        "dinner",
      ];
      const allRecommendations = await this.generateRecommendations(
        mealTypes,
        nextDay
      );
      return {
        status: "success",
        message: "Next day recommendations generated successfully.",
        recommendations: allRecommendations,
      };
    } catch (error) {
      console.error("Error generating next day recommendation:", error);
      return {
        status: "error",
        message: "Error generating next day recommendation.",
      };
    }
  }

  private async generateRecommendations(
    mealTypes: ("breakfast" | "lunch" | "dinner")[],
    nextDay: string
  ) {
    const allRecommendations = [];

    for (const mealType of mealTypes) {
      const numberOfRecommendations = this.getNumberOfRecommendations(mealType);
      const topRatedItems = await MenuService.getTopRatedMenuItems(
        mealType,
        numberOfRecommendations
      );
      const recommendations = await this.createRecommendations(
        topRatedItems,
        mealType,
        nextDay
      );
      allRecommendations.push(...recommendations);
    }

    return allRecommendations;
  }

  private async createRecommendations(
    menuItems: Menu[],
    mealType: string,
    recommendationDate: string
  ): Promise<Recommendation[]> {
    const recommendations = await Promise.all(
      menuItems.map(async (item) => {
        const feedbacks = await FeedbackService.getFeedbackForMenu(
          item.menu_id
        );
        const averageRating = this.calculateAverageRating(feedbacks);
        const averageSentiment =
          await sentimentAnalysisService.calculateAverageSentiment(feedbacks);

        return this.saveRecommendation(
          item.menu_id,
          mealType,
          recommendationDate,
          averageRating,
          averageSentiment
        );
      })
    );

    return recommendations;
  }

  // store in recommen. table
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

  async getNextDayRecommendations() {
    const mealTypes: ("breakfast" | "lunch" | "dinner")[] = [
      "breakfast",
      "lunch",
      "dinner",
    ];

    const nextDay = DateService.getNthPreviousDate(-1);
    const today = DateService.getNthPreviousDate(0);

    const allRecommendations = await sqlDBOperations.runCustomQuery(
      `select * from Recommendation where recommendation_date between '${today}' and '${nextDay}'`
    );
    console.log("allRecommendations", allRecommendations);

    return {
      status: "success",
      message: "Next day recommendations generated successfully.",
      recommendations: allRecommendations,
    };
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

export const recommendationService = new RecommendationService();
