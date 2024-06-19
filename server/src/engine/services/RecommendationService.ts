import { Menu } from "../../models/Menu";
import { Feedback } from "../../models/Feedback";
import { Recommendation } from "../../models/Recommendation";
import { sqlDBOperations } from "../../database/operations/sqlDBOperations";
import { sentimentAnalysisService } from "./SentimentAnalysisService";
import DateService from "../../services/DateService";

class RecommendationService {
  async generateNextDayRecommendation(): Promise<Object> {
    try {
      const nextDay = DateService.getNthPreviousDate(-1);
      const mealTypes: ("breakfast" | "lunch" | "dinner")[] = [
        // "breakfast",
        "lunch",
        // "dinner",
      ];
      const allRecommendations = await this.generateRecommendationsForMealTypes(
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

  private async generateRecommendationsForMealTypes(
    mealTypes: ("breakfast" | "lunch" | "dinner")[],
    nextDay: string
  ) {
    const allRecommendations = [];
    for (const mealType of mealTypes) {
      const recommendations = await this.generateRecommendationsForMealType(
        mealType,
        nextDay
      );
      allRecommendations.push(...recommendations);
    }
    return allRecommendations;
  }

  private async generateRecommendationsForMealType(
    mealType: "breakfast" | "lunch" | "dinner",
    nextDay: string
  ) {
    const numberOfRecommendations = this.getNumberOfRecommendations(mealType);
    const topRatedItems = await this.getTopRatedMenuItems(
      mealType,
      numberOfRecommendations
    );
    return this.createRecommendations(topRatedItems, mealType, nextDay);
  }

  private getNumberOfRecommendations(
    mealType: "breakfast" | "lunch" | "dinner"
  ): number {
    return 2; // default to 2 recommendations for simplicity
  }

  private async getTopRatedMenuItems(
    mealType: "breakfast" | "lunch" | "dinner",
    limit: number
  ): Promise<Menu[]> {
    const feedbacks = await this.getAllFeedbacks();
    const sentimentResults =
      await sentimentAnalysisService.analyzeFeedbackSentiments(feedbacks);
    const menuFeedbackMap = this.mapFeedbacksToMenuItems(
      feedbacks,
      sentimentResults
    );
    const sortedMenuIds = this.sortMenuItemsByRatingAndSentiment(
      menuFeedbackMap,
      limit
    );
    return this.getMenuItems(mealType, sortedMenuIds);
  }

  private async getAllFeedbacks(): Promise<Feedback[]> {
    const Feedbacks = sqlDBOperations.selectAll("Feedback") as Promise<
      Feedback[]
    >;
    return Feedbacks;
  }

  private mapFeedbacksToMenuItems(
    feedbacks: Feedback[],
    sentimentResults: { feedback_id: number; sentiment: number }[]
  ): {
    [key: number]: {
      totalRating: number;
      count: number;
      totalSentiment: number;
    };
  } {
    const menuFeedbackMap: {
      [key: number]: {
        totalRating: number;
        count: number;
        totalSentiment: number;
      };
    } = {};

    feedbacks.forEach((feedback) => {
      const sentiment =
        sentimentResults.find(
          (result) => result.feedback_id === feedback.feedback_id
        )?.sentiment || 0;

      if (!menuFeedbackMap[feedback.menu_id]) {
        menuFeedbackMap[feedback.menu_id] = {
          totalRating: 0,
          count: 0,
          totalSentiment: 0,
        };
      }

      menuFeedbackMap[feedback.menu_id].totalRating += feedback.rating;
      menuFeedbackMap[feedback.menu_id].count += 1;
      menuFeedbackMap[feedback.menu_id].totalSentiment += sentiment;
    });

    return menuFeedbackMap;
  }

  private sortMenuItemsByRatingAndSentiment(
    menuFeedbackMap: {
      [key: number]: {
        totalRating: number;
        count: number;
        totalSentiment: number;
      };
    },
    limit: number
  ): number[] {
    const menuEntries = Object.entries(menuFeedbackMap).map(
      ([menuId, stats]) => ({
        menuId: Number(menuId),
        avgRating: stats.totalRating / stats.count,
        avgSentiment: stats.totalSentiment / stats.count,
      })
    );

    menuEntries.sort(
      (a, b) => b.avgRating + b.avgSentiment - (a.avgRating + a.avgSentiment)
    );

    return menuEntries.slice(0, limit).map((entry) => entry.menuId);
  }

  private async getMenuItems(
    mealType: string,
    menuIds: number[]
  ): Promise<Menu[]> {
    return sqlDBOperations.selectAll(
      "Menu",
      { meal_type: mealType, menu_id: menuIds },
      {},
      { meal_type: "=", menu_id: "IN" }
    ) as Promise<Menu[]>;
  }

  private async createRecommendations(
    menuItems: Menu[],
    mealType: string,
    recommendationDate: string
  ): Promise<Recommendation[]> {
    return Promise.all(
      menuItems.map((item) =>
        this.createRecommendation(item, mealType, recommendationDate)
      )
    );
  }

  private async createRecommendation(
    item: Menu,
    mealType: string,
    recommendationDate: string
  ): Promise<Recommendation> {
    const feedbacks = await this.getFeedbackForMenu(item.menu_id);
    const averageRating = this.calculateAverageRating(feedbacks);
    const recommendation = this.buildRecommendation(
      item.menu_id,
      mealType,
      recommendationDate,
      averageRating
    );
    return this.saveRecommendation(recommendation);
  }

  private async getFeedbackForMenu(menuId: number): Promise<Feedback[]> {
    return sqlDBOperations.selectAll("Feedback", {
      menu_id: menuId,
    }) as Promise<Feedback[]>;
  }

  private calculateAverageRating(feedbacks: Feedback[]): number {
    return (
      feedbacks.reduce((sum, feedback) => sum + feedback.rating, 0) /
      feedbacks.length
    );
  }

  private buildRecommendation(
    menuId: number,
    mealType: any,
    recommendationDate: string,
    averageRating: number
  ): Recommendation {
    return {
      meal_type: mealType,
      recommendation_date: recommendationDate as unknown as Date,
      average_rating: averageRating,
      is_prepared: null, // to be set by chef later
      menu_id: menuId,
    };
  }

  private async saveRecommendation(
    recommendation: Recommendation
  ): Promise<Recommendation> {
    console.log("recommendation", recommendation);

    const result = await sqlDBOperations.insert(
      "Recommendation",
      recommendation
    );
    if (!result) throw new Error("Failed to insert recommendation");
    return result;
  }
}

export const recommendationService = new RecommendationService();
