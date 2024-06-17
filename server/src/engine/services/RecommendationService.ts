import { Menu } from "../../models/Menu";
import { Feedback } from "../../models/Feedback";
import { Recommendation } from "../../models/Recommendation";
import { sqlDBOperations } from "../../database/operations/sqlDBOperations";
import { sentimentAnalysisService } from "./SentimentAnalysisService";
import DateService from "../../services/DateService";

class RecommendationService {
  async generateNextDayRecommendation(): Promise<Object> {
    try {
      const nextDay: string = DateService.getNthPreviousDate(-1);
      const mealTypes: ("breakfast" | "lunch" | "dinner")[] = [
        "breakfast",
        // "lunch",
        // "dinner",
      ];

      const allRecommendations = [];

      for (const mealType of mealTypes) {
        let numberOfRecommendations =
          mealType === "breakfast" ? 2 : mealType === "lunch" ? 2 : 2;

        const topRatedItems = await this.getTopRatedMenuItems(
          mealType,
          numberOfRecommendations
        );

        const recommendations = await this.createRecommendations(
          topRatedItems,
          mealType,
          nextDay
        );
        console.log(
          "mealType",
          mealType,
          ", topRatedItems",
          topRatedItems,
          "recommendations",
          recommendations
        );

        allRecommendations.push(...recommendations);
      }

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

  private async getTopRatedMenuItems(
    mealType: "breakfast" | "lunch" | "dinner",
    limit: number
  ): Promise<Menu[]> {
    const feedbacks = (await sqlDBOperations.selectAll(
      "Feedback"
    )) as Feedback[];
    console.log("getTopRatedMenuItems - all feedbacks", feedbacks);

    const menuFeedbackMap: {
      [key: number]: { totalRating: number; count: number };
    } = {};

    for (const feedback of feedbacks) {
      if (!menuFeedbackMap[feedback.menu_id]) {
        menuFeedbackMap[feedback.menu_id] = { totalRating: 0, count: 0 };
      }
      menuFeedbackMap[feedback.menu_id].totalRating += feedback.rating;
      menuFeedbackMap[feedback.menu_id].count += 1;
    }

    let menuIds: number[] = [];

    if (mealType === "breakfast") {
      menuIds = Object.keys(menuFeedbackMap)
        .map(Number)
        .sort((a, b) => {
          const avgRatingA =
            menuFeedbackMap[a].totalRating / menuFeedbackMap[a].count;
          const avgRatingB =
            menuFeedbackMap[b].totalRating / menuFeedbackMap[b].count;
          console.log(
            "FOR breakfast - menuFeedbackMap , avgRatingA , avgRatingB",
            menuFeedbackMap,
            avgRatingA,
            avgRatingB
          );

          return avgRatingB - avgRatingA;
        })
        .slice(0, limit);
    } else if (mealType === "lunch") {
      menuIds = Object.keys(menuFeedbackMap)
        .map(Number)
        .sort((a, b) => {
          const avgRatingA =
            menuFeedbackMap[a].totalRating / menuFeedbackMap[a].count;
          const avgRatingB =
            menuFeedbackMap[b].totalRating / menuFeedbackMap[b].count;
          return avgRatingB - avgRatingA;
        })
        .slice(0, limit);
    } else if (mealType === "dinner") {
      menuIds = Object.keys(menuFeedbackMap)
        .map(Number)
        .sort((a, b) => {
          const avgRatingA =
            menuFeedbackMap[a].totalRating / menuFeedbackMap[a].count;
          const avgRatingB =
            menuFeedbackMap[b].totalRating / menuFeedbackMap[b].count;
          return avgRatingB - avgRatingA;
        })
        .slice(0, limit);
    }

    const menuItems = (await sqlDBOperations.selectAll(
      "Menu",
      { meal_type: mealType, menu_id: menuIds },
      {},
      { meal_type: "=", menu_id: "IN" }
    )) as Menu[];
    console.log("menuItems", menuItems);

    return menuItems;
  }

  private async getFeedbackForMenu(menuId: number): Promise<Feedback[]> {
    return (await sqlDBOperations.selectAll("Feedback", {
      menu_id: menuId,
    })) as Feedback[];
  }

  private async createRecommendations(
    menuItems: Menu[],
    mealType: "breakfast" | "lunch" | "dinner",
    recommendationDate: string
  ): Promise<Recommendation[]> {
    const recommendations = [];

    for (const item of menuItems) {
      const feedbacks = await this.getFeedbackForMenu(item.menu_id);
      const sentimentResults =
        await sentimentAnalysisService.analyzeFeedbackSentiments(feedbacks);
      console.log(sentimentResults, "sentimentResults");

      const averageRating =
        feedbacks.reduce((sum, feedback) => sum + feedback.rating, 0) /
        feedbacks.length;
      const isPrepared = null; // later chef will chose whom to make true/false

      const recommendation: Recommendation = {
        meal_type: mealType,
        recommendation_date: recommendationDate as unknown as Date,
        average_rating: averageRating,
        is_prepared: isPrepared,
        menu_id: item.menu_id,
      };

      const result = await sqlDBOperations.insert(
        "Recommendation",
        recommendation
      );
      if (result) {
        recommendations.push(result);
      } else {
        throw new Error("Failed to insert recommendation");
      }
    }

    return recommendations;
  }
}

export const recommendationService = new RecommendationService();
