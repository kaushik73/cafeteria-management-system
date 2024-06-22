import { Feedback } from "../models/Feedback";
import { sqlDBOperations } from "../database/operations/sqlDBOperations";
import { FeedbackReport, FeedbackRow } from "../common/types";
import LogService from "./LogService";
import userDetailStore from "../store/userDetailStore";
import { User } from "../models/Users";

class FeedbackService {
  static async giveFeedback(feedback: Feedback) {
    console.log("giveFeedback");

    const result = await sqlDBOperations.insert("Feedback", feedback);
    console.log("feedback res", result);

    return result;
  }

  static async viewFeedbacks(data: any) {
    const userDetail: User | null = await userDetailStore.getUserDetail();
    console.log("viewFeedbacks", userDetail);

    const action = `For Menu id : ${data.menu_id} ${userDetail?.name} view Feedback`;
    const logOutput = await LogService.logAction(
      action,
      userDetail?.emp_id as number
    );
    const feedbacks = await sqlDBOperations.selectAll(
      "Feedback",
      { menu_id: data.menu_id },
      {},
      {}
    );
    console.log("feedback res", feedbacks);

    return feedbacks;
  }

  //  new
  static async getAllFeedbacks(): Promise<Feedback[]> {
    const feedbacks = await sqlDBOperations.selectAll("Feedback");
    return feedbacks as Feedback[];
  }

  static async getFeedbackForMenu(menuId: number): Promise<Feedback[]> {
    return sqlDBOperations.selectAll("Feedback", {
      menu_id: menuId,
    }) as Promise<Feedback[]>;
  }

  static mapFeedbacksToMenuItems(
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

export default FeedbackService;
