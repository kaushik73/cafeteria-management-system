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
import userDetailStore from "../../store/userDetailStore";
import LogService from "../../services/LogService";
import MenuService from "../../services/MenuService";

class Employee {
  static registerHandlers(socketService: SocketService, socket: Socket) {
    const handlers: { [event: string]: (data: any, callback: any) => void } = {
      seeNotifications: Employee.handleSeeNotifications,
      showMenuItems: Employee.handleShowMenuItems,
      giveFeedback: Employee.handleGiveFeedback,
      viewPreferenceRecommendedFood:
        Employee.handleViewPreferenceRecommendedFood,
      voteForRecommendedFood: Employee.handleVoteForRecommendedFood,
      updatedPreference: Employee.handleUpdatedPreference,
    };

    for (const [event, handler] of Object.entries(handlers)) {
      socketService.registerEventHandler(socket, event, handler);
    }
  }

  private static async logAction(action: string) {
    const userDetail: IUserAndPreference | null =
      await userDetailStore.getUserDetail();
    if (userDetail) {
      await LogService.logAction(`${userDetail.name} ${action}`);
    }
  }

  static async handleSeeNotifications(
    data: any,
    callback: (response: any) => void
  ) {
    try {
      const notifications = await NotificationService.seeNotifications();
      await Employee.logAction("saw Notification");
      callback({ message: notifications });
    } catch (error) {
      console.error("Error fetching notifications:", error);
      callback({ message: "Error fetching notifications" });
    }
  }

  static async handleGiveFeedback(
    data: any,
    callback: (response: any) => void
  ) {
    try {
      if (await MenuService.isMenuIdExist(data.menu_id)) {
        const feedback_date = DateService.getCurrentDate();
        const updatedData = { feedback_date, ...data };
        await FeedbackService.giveFeedback(updatedData);
        await Employee.logAction("gave Feedback");
        callback({ message: "Feedback Added" });
      } else {
        callback({ message: "Menu Does not exist" });
      }
    } catch (error) {
      console.error("Error giving feedback:", error);
      callback({ message: "Error giving feedback" });
    }
  }

  static async handleShowMenuItems(
    data: any,
    callback: (response: any) => void
  ) {
    User.handleShowMenuItems(data, callback);
  }

  static async handleViewPreferenceRecommendedFood(
    data: { userDatail: IUserAndPreference },
    callback: (response: any) => void
  ) {
    try {
      const recommendedFood: Recommendation[] =
        await RecommendationService.viewPreferenceRecommendedFood(
          data.userDatail.user_id as number
        );
      await Employee.logAction("viewed Preference Recommended Food");
      callback({ recommendedFood });
    } catch (error) {
      console.error("Error fetching recommended food:", error);
      callback({ message: "Error fetching recommended food" });
    }
  }

  static async handleVoteForRecommendedFood(
    data: {
      voteForRecommendedFood: { [key: string]: number[] };
      userDetail: IUserAndPreference;
    },
    callback: (response: { message: string }) => void
  ) {
    try {
      await Employee.processVotes(
        data.voteForRecommendedFood,
        data.userDetail.user_id as number
      );
      await Employee.logAction("voted for Recommended Food");
      callback({ message: "vote sent successfully" });
    } catch (error) {
      console.error("Error voting for recommended food:", error);
      callback({ message: "error" });
    }
  }

  static async handleUpdatedPreference(
    data: any,
    callback: (response: { message: string }) => void
  ) {
    if (
      data.updatedPreference &&
      Object.keys(data.updatedPreference).length > 0
    ) {
      await MenuService.updatedUserPreference(data);
      callback({ message: "Preference updated successfully" });
    } else {
      callback({ message: "No Updates Made" });
    }
  }

  private static async processVotes(
    votes: { [key: string]: number[] },
    userId: number
  ) {
    const processedIds: number[] = [];

    for (const mealType of Object.keys(votes)) {
      const votedIds = votes[mealType];

      for (const votedId of votedIds) {
        if (votedId === 0 || processedIds.includes(votedId)) {
          continue;
        }

        const isValid = await MenuService.isMenuIdExist(votedId);

        if (isValid) {
          const votedItemObj: VotedItem = {
            user_id: userId,
            is_voted: true,
            menu_id: votedId,
          };

          await sqlDBOperations.insert("votedItem", votedItemObj);
          processedIds.push(votedId);
        }
      }
    }
  }
}

export default Employee;
