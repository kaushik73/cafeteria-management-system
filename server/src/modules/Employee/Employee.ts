import { Socket } from "socket.io";
import SocketService from "../../services/SocketService";
import NotificationService from "../../services/NotificationService";
import FeedbackService from "../../services/FeedbackService";
import DateService from "../../services/DateService";
import User from "../User/User";
import { IUser } from "../../models/User";
import { sqlDBOperations } from "../../database/operations/sqlDBOperations";
import { Recommendation } from "../../models/Recommendation";
import { VotedItem } from "../../models/VotedItem";

class Employee {
  static registerHandlers(socketService: SocketService, socket: Socket) {
    console.log("in registerHandlers employee");

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
      "viewRecommendedFood",
      Employee.viewRecommendedFood
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
      console.log("handleGiveFeedback", updatedData);
      const feedback = await FeedbackService.giveFeedback(updatedData);
      console.log("message - feedback", { message: feedback });
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

  static async viewRecommendedFood(
    data: {},
    callback: (response: any) => void
  ) {
    const recommendedFood: Recommendation[] = (await sqlDBOperations.selectAll(
      "recommendation",
      { rollout_to_employee: true }
    )) as Recommendation[];
    callback({ recommendedFood: recommendedFood });
  }

  // static async voteForRecommendedFoodMine(
  //   data: {
  //     voteForRecommendedFood: { [key: string]: number[] };
  //     userDetail: IUser;
  //   },
  //   callback: (response: { message: string }) => void
  // ) {
  //   console.log(data.voteForRecommendedFood, "data.voteForRecommendedFood");
  //   let votedItemObj: VotedItem = {
  //     user_id: 0,
  //     is_voted: false,
  //     menu_id: 0,
  //   };
  //   for (const mealType of Object.keys(data.voteForRecommendedFood)) {
  //     const votedIds = data.voteForRecommendedFood[mealType];
  //     console.log("mealType", mealType, "votedIds", votedIds);

  //     for (const votedId of votedIds) {
  //       votedItemObj = {
  //         user_id: data.userDetail.user_id as number,
  //         is_voted: true,
  //         menu_id: votedId,
  //       };
  //     }
  //   }
  //   const voteForRecommendedFood: VotedItem[] = await sqlDBOperations.insert(
  //     "votedItem",
  //     votedItemObj
  //   );
  //   callback({ message: "success" });
  // }

  static async voteForRecommendedFood(
    data: {
      voteForRecommendedFood: { [key: string]: number[] };
      userDetail: IUser;
    },
    callback: (response: { message: string }) => void
  ) {
    try {
      console.log(data.voteForRecommendedFood, "data.voteForRecommendedFood");

      // const votedItems: VotedItem[] = [];

      for (const mealType of Object.keys(data.voteForRecommendedFood)) {
        const votedIds = data.voteForRecommendedFood[mealType];
        console.log("mealType", mealType, "votedIds", votedIds);

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
            console.log(result, "result");
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
