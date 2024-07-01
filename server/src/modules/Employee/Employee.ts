import { Socket } from "socket.io";
import SocketService from "../../services/SocketService";
import NotificationService from "../../services/NotificationService";
import FeedbackService from "../../services/FeedbackService";
import DateService from "../../services/DateService";
import User from "../User/User";
import { IUserAndPreference } from "../../models/User";
import { sqlDBOperations } from "../../database/operations/sqlDBOperations";
import { Recommendation } from "../../models/Recommendation";
import { VotedItem } from "../../models/VotedItem";
import RecommendationService from "../../services/RecommendationService";

class Employee {
  static registerHandlers(socketService: SocketService, socket: Socket) {
    socketService.registerEventHandler(
      socket,
      "seeNotifications",
      Employee.handleSeeNotifications
    );
    socketService.registerEventHandler(
      socket,
      "showMenuItems",
      Employee.handleShowMenuItems
    );
    socketService.registerEventHandler(
      socket,
      "giveFeedback",
      Employee.handleGiveFeedback
    );
    socketService.registerEventHandler(
      socket,
      "viewPreferenceRecommendedFood",
      Employee.viewPreferenceRecommendedFood
    );
    socketService.registerEventHandler(
      socket,
      "voteForRecommendedFood",
      Employee.voteForRecommendedFood
    );
  }
  static async handleSeeNotifications(
    data: any,
    callback: (response: any) => void
  ) {
    try {
      const notifications = await NotificationService.seeNotifications();
      callback({ message: notifications });
    } catch (error) {
      callback({ message: "Error fetching notifications" });
      console.error("Error fetching notifications:", error);
    }
  }

  static async handleGiveFeedback(
    data: any,
    callback: (response: any) => void
  ) {
    try {
      const feedback_date = DateService.getCurrentDate();
      const updatedData = { feedback_date, ...data };
      const feedback = await FeedbackService.giveFeedback(updatedData);
      callback({ message: "Feedback Added" });
    } catch (error) {
      callback({ message: "Error giving feedback" });
      console.error("Error giving feedback:", error);
    }
  }

  static async handleShowMenuItems(
    data: any,
    callback: (response: any) => void
  ) {
    User.handleShowMenuItems(data, callback);
  }

  static async viewPreferenceRecommendedFood(
    data: { userDatail: IUserAndPreference },
    callback: (response: any) => void
  ) {
    const recommendedFood: Recommendation[] =
      (await RecommendationService.viewPreferenceRecommendedFood(
        data.userDatail.user_id as number
      )) as Recommendation[];
    callback({ recommendedFood: recommendedFood });
  }

  static async voteForRecommendedFood(
    data: {
      voteForRecommendedFood: { [key: string]: number[] };
      userDetail: IUserAndPreference;
    },
    callback: (response: { message: string }) => void
  ) {
    try {
      for (const mealType of Object.keys(data.voteForRecommendedFood)) {
        const votedIds = data.voteForRecommendedFood[mealType];
        for (const votedId of votedIds) {
          if (votedId !== 0) {
            const votedItemObj: VotedItem = {
              user_id: data.userDetail.user_id as number,
              is_voted: true,
              menu_id: votedId,
            };
            const result = await sqlDBOperations.insert(
              "votedItem",
              votedItemObj
            );
          }
        }
      }
      callback({ message: "vote sent successfully" });
    } catch (error) {
      console.error("Error voting for recommended food:", error);
      callback({ message: "error" });
    }
  }
}
export default Employee;
