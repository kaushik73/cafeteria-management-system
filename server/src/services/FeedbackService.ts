import { Feedback } from "../models/Feedback";
import { sqlDBOperations } from "../database/operations/sqlDBOperations";
import { FeedbackReport, FeedbackRow } from "../common/types";

class FeedbackService {
  static async giveFeedback(feedback: Feedback) {
    console.log("giveFeedback");

    const result = await sqlDBOperations.insert("Feedback", feedback);
    console.log("feedback res", result);

    return result;
  }

  static async viewFeedbacks(data: any) {
    const feedbacks = await sqlDBOperations.selectAll(
      "Feedback",
      { menu_id: data.menu_id },
      {},
      {}
    );
    console.log("feedback res", feedbacks);

    return feedbacks;
  }
}

export default FeedbackService;
