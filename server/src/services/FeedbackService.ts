import { Feedback } from "../models/Feedback";
import { sqlDBOperations } from "../database/operations/sqlDBOperations";
// import LogService from "./LogService";
import userDetailStore from "../store/userDetailStore";
import { DiscardMenuFeedback } from "../models/DiscardMenuFeedback";
// import { IUser  } from "../models/User";

export default class FeedbackService {
  static async giveFeedback(feedback: Feedback) {
    console.log("giveFeedback");

    const result = await sqlDBOperations.insert("Feedback", feedback);
    console.log("feedback res", result);

    return result;
  }

  static async viewFeedbacks(menuId: number): Promise<Feedback[]> {
    const feedbacks = (await sqlDBOperations.selectAll(
      "Feedback",
      { menu_id: menuId },
      {},
      {}
    )) as Feedback[];
    console.log("feedback res", feedbacks);

    return feedbacks;
  }
  static async addToDiscardMenuFeedback(
    DiscardMenuFeedback: DiscardMenuFeedback
  ) {
    console.log("DiscardMenuFeedback", DiscardMenuFeedback);

    const result = await sqlDBOperations.insert(
      "DiscardMenuFeedback",
      DiscardMenuFeedback
    );
    return result;
  }
}

// export const feedbackService = new FeedbackService();
