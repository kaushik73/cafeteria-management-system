import { MealTypes, Menu } from "../../models/Menu";
import { Feedback } from "../../models/Feedback";
import { Recommendation } from "../../models/Recommendation";
import { sqlDBOperations } from "../../database/operations/sqlDBOperations";
import { sentimentAnalysisService } from "./SentimentAnalysisService";
import DateService from "../../services/DateService";
import { mealTypeLimit } from "../../common/contants";

class RecommendationService {
  async generateNextDayRecommendation(): Promise<Object> {
    try {
      const nextDay = DateService.getNthPreviousDate(-1);
      const mealTypes: ("breakfast" | "lunch" | "dinner")[] = [
        "breakfast",
        "lunch",
        "dinner",
      ];
      console.log("Next day:", nextDay);
      const allRecommendations = await this.generateRecommendationsForMealTypes(
        mealTypes,
        nextDay
      );
      console.log("All Recommendations:", allRecommendations);
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
      console.log("Generating recommendations for meal type:", mealType);
      const recommendations = await this.generateRecommendationsForMealType(
        mealType,
        nextDay
      );
      console.log(`Recommendations for ${mealType}:`, recommendations);
      allRecommendations.push(...recommendations);
    }
    return allRecommendations;
  }

  private async generateRecommendationsForMealType(
    mealType: "breakfast" | "lunch" | "dinner",
    nextDay: string
  ) {
    const numberOfRecommendations = this.getNumberOfRecommendations(mealType);
    console.log(
      `Number of recommendations for ${mealType}:`,
      numberOfRecommendations
    );
    const topRatedItems = await this.getTopRatedMenuItems(
      mealType,
      numberOfRecommendations
    );
    console.log(`Top rated items for ${mealType}:`, topRatedItems);
    return this.createRecommendations(topRatedItems, mealType, nextDay);
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

  private async getTopRatedMenuItems(
    mealType: "breakfast" | "lunch" | "dinner",
    limit: number
  ): Promise<Menu[]> {
    const feedbacks = await this.getAllFeedbacks();
    console.log("Feedbacks:", feedbacks);
    const sentimentResults =
      await sentimentAnalysisService.analyzeFeedbackSentiments(feedbacks);
    console.log("Sentiment results:", sentimentResults);
    const menuFeedbackMap = this.mapFeedbacksToMenuItems(
      feedbacks,
      sentimentResults
    );
    console.log("Menu feedback map:", menuFeedbackMap);
    const sortedMenuIds = await this.sortMenuItemsByRatingAndSentiment(
      menuFeedbackMap,
      limit,
      mealType
    );
    console.log("top menu IDs: for ", mealType, "are", sortedMenuIds);
    return this.getMenuItems(mealType, sortedMenuIds);
  }

  private async getAllFeedbacks(): Promise<any[]> {
    const Feedbacks = await sqlDBOperations.selectAll("Feedback");
    console.log("All feedbacks fetched from database:", Feedbacks);
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

  async getMealType(menuId: number): Promise<unknown> {
    const mealType: any = await sqlDBOperations.selectOne("Menu", {
      menu_id: menuId,
    });
    console.log("mealType", mealType.meal_type);

    return mealType.meal_type;
  }

  private async sortMenuItemsByRatingAndSentiment(
    menuFeedbackMap: {
      [key: number]: {
        totalRating: number;
        count: number;
        totalSentiment: number;
      };
    },
    limit: number,
    mealType: string
  ): Promise<number[]> {
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

    console.log("Menu entries sorted by rating and sentiment:", menuEntries);
    const filteredEntries = await Promise.all(
      menuEntries.map(async (entry) => {
        const type = await this.getMealType(entry.menuId);
        return type === mealType ? entry : null;
      })
    );

    const validEntries = filteredEntries.filter((entry) => entry !== null) as {
      menuId: number;
    }[];

    const limitedEntries = validEntries.slice(0, limit);

    return limitedEntries.map((entry) => entry.menuId);
  }

  private async getMenuItems(
    mealType: string,
    menuIds: number[]
  ): Promise<Menu[]> {
    console.log(
      "Fetching menu items for meal type and IDs:",
      mealType,
      menuIds
    );
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
    console.log("Creating recommendations for menu items:", menuItems);
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
    const averageSentiment =
      await sentimentAnalysisService.calculateAverageSentiment(feedbacks);
    const recommendation = this.buildRecommendation(
      item.menu_id,
      mealType,
      recommendationDate,
      averageRating,
      averageSentiment
    );
    console.log("Built recommendation:", recommendation);
    return this.saveRecommendation(recommendation);
  }

  private async getFeedbackForMenu(menuId: number): Promise<Feedback[]> {
    console.log("Fetching feedback for menu ID:", menuId);
    return sqlDBOperations.selectAll("Feedback", {
      menu_id: menuId,
    }) as Promise<Feedback[]>;
  }

  private calculateAverageRating(feedbacks: Feedback[]): number {
    const ratings = feedbacks.map((feedback) => {
      console.log("feedback.rating", feedback.rating);
      return feedback.rating;
    });

    let totalRating = 0;
    for (let i = 0; i < ratings.length; i++) {
      totalRating += ratings[i];
    }
    console.log("totalRating", totalRating);

    const averageRating = totalRating / feedbacks.length;

    console.log("Calculated average rating:", averageRating);
    return averageRating;
  }

  private buildRecommendation(
    menuId: number,
    mealType: any,
    recommendationDate: string,
    averageRating: number,
    averageSentiment: number
  ): Recommendation {
    return {
      meal_type: mealType,
      recommendation_date: recommendationDate as unknown as Date,
      average_rating: averageRating,
      rollout_to_employee: null, // to be set by chef later
      average_sentiment: averageSentiment,
      menu_id: menuId,
    };
  }

  private async saveRecommendation(
    recommendation: Recommendation
  ): Promise<Recommendation> {
    console.log("Saving recommendation:", recommendation);
    const result = await sqlDBOperations.insert(
      "Recommendation",
      recommendation
    );
    if (!result) throw new Error("Failed to insert recommendation");
    return result;
  }

  private async getNextDayRecommendationForMealType(mealType: string) {
    const nextDay = DateService.getNthPreviousDate(-1);
    const today = DateService.getNthPreviousDate(0);
    console.log(nextDay, "nextDay");

    const recommendation = await sqlDBOperations.runCustomQuery(
      `select * from Recommendation where meal_type = '${mealType}' and recommendation_date between '${today}' and '${nextDay}'`
    );
    console.log("getNextDayRecommendationForMealType", recommendation);

    return recommendation;
  }

  async getNextDayRecommendations() {
    const mealTypes: ("breakfast" | "lunch" | "dinner")[] = [
      "breakfast",
      "lunch",
      "dinner",
    ];

    const recommendationsPromises = mealTypes.map(async (mealType) => {
      const recommendations = await this.getNextDayRecommendationForMealType(
        mealType
      );
      return { mealType, recommendations };
    });

    const recommendationsArray = await Promise.all(recommendationsPromises);
    const allRecommendations = recommendationsArray.reduce(
      (acc, { mealType, recommendations }) => {
        acc[mealType] = recommendations;
        return acc;
      },
      {} as Record<string, any[]>
    );

    console.log("allRecommendations", allRecommendations);

    return {
      status: "success",
      message: "Next day recommendations generated successfully.",
      recommendations: allRecommendations,
    };
  }
}

export const recommendationService = new RecommendationService();
