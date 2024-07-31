import { Feedback } from "../models/Feedback";
import { sqlDBOperations } from "../database/operations/sqlDBOperations";
import { DiscardMenuFeedback } from "../models/DiscardMenuFeedback";

export default class FeedbackService {
  static async giveFeedback(feedback: Feedback) {
    const result = await sqlDBOperations.insert("Feedback", feedback);
    return result;
  }

  static async viewFeedbacks(menuId: number): Promise<Feedback[]> {
    const feedbacks = (await sqlDBOperations.selectAll(
      "Feedback",
      { menu_id: menuId },
      {},
      {}
    )) as Feedback[];
    return feedbacks;
  }
  static async addToDiscardMenuFeedback(
    DiscardMenuFeedback: DiscardMenuFeedback
  ) {
    const result = await sqlDBOperations.insert(
      "DiscardMenuFeedback",
      DiscardMenuFeedback
    );
    return result;
  }
}
