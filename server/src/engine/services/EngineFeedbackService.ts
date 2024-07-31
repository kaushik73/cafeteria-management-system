import { sqlDBOperations } from "../../database/operations/sqlDBOperations";
import { Feedback } from "../../models/Feedback";

class EngineFeedbackService {
  async getAllFeedbacks(): Promise<Feedback[]> {
    const feedbacks = await sqlDBOperations.selectAll("Feedback");
    return feedbacks as Feedback[];
  }

  async getFeedbackForMenu(menuId: number): Promise<Feedback[]> {
    return sqlDBOperations.selectAll("Feedback", {
      menu_id: menuId,
    }) as Promise<Feedback[]>;
  }

  mapFeedbacksToMenuItems(
    feedbacks: Feedback[],
    sentimentResults: { feedback_id: number; sentiment: number }[]
  ) {
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
}

export const engineFeedbackService = new EngineFeedbackService();
