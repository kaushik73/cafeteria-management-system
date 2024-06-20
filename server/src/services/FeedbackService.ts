import { Feedback } from "../models/Feedback";
import { sqlDBOperations } from "../database/operations/sqlDBOperations";
import { FeedbackReport, FeedbackRow } from "../common/types";
import LogService from "./LogService";
import userDetailStore from "../store/userDetailStore";
import { User } from "../models/Users";
// import User from "../modules/User/User";

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
}

export default FeedbackService;
