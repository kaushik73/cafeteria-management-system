import { Socket } from "socket.io";
import SocketService from "../../services/SocketService";
import NotificationService from "../../services/NotificationService";

class Employee {
  //   static registerHandlers(socket: Socket) {
  //     const addFeedbackHandler = SocketServiceFactory.createHandler("addFeedback", async (socket, feedback, callback) => {
  //       try {
  //         const response = await FeedbackService.addFeedback(feedback);
  //         callback({ message: "Feedback added successfully", response });
  //       } catch (error) {
  //         callback({ message: "Error adding feedback", error: error.message });
  //       }
  //     });
  //     const getFeedbackReportHandler = SocketServiceFactory.createHandler("getFeedbackReport", async (socket, month, year, callback) => {
  //       try {
  //         const response = await FeedbackService.getMonthlyFeedbackReport(month, year);
  //         callback({ message: "Feedback report generated successfully", response });
  //       } catch (error) {
  //         callback({ message: "Error generating feedback report", error: error.message });
  //       }
  //     });
  //     addFeedbackHandler(socket);
  //     getFeedbackReportHandler(socket);
  //   }
  static registerHandlers(socketService: SocketService, socket: Socket) {
    console.log("in registerHandlers employee");

    socketService.registerEventHandler(

      socket,
      "seeNotifications",
      Employee.handleSeeNotifications
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
}
export default Employee;
