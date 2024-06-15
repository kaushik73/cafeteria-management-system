import InputService from "./InputService";
import { socket } from "./SocketService";

export default class ChefService {
  static generateFoodRecommendations() {
    // Implement logic for generating food recommendations
  }

  static respondToFeedback() {
    const feedbackID = parseInt(
      InputService.takeInput("Enter feedback ID to respond: ")
    );
    const response = InputService.takeInput("Enter your response: ");

    socket.emitEvent(
      "respondToFeedback",
      { feedbackID, response },
      (response) => {
        console.log(response);
      }
    );
  }

  static generateMonthlyFeedbackReport() {
    socket.emitEvent("generateMonthlyFeedbackReport", {}, (response) => {
      console.log(response);
    });
  }

  static viewReports() {
    socket.emitEvent("viewReports", {}, (response) => {
      console.log(response);
    });
  }

  static sendRecommendationNotification() {
    const message = InputService.takeInput("Enter notification message: ");

    socket.emitEvent(
      "sendRecommendationNotification",
      { message },
      (response) => {
        console.log(response);
      }
    );
  }

  static sendMenuUpdateNotification() {
    const message = InputService.takeInput("Enter notification message: ");

    socket.emitEvent("sendMenuUpdateNotification", { message }, (response) => {
      console.log(response);
    });
  }

  static sendAvailabilityNotification() {
    const message = InputService.takeInput("Enter notification message: ");

    socket.emitEvent(
      "sendAvailabilityNotification",
      { message },
      (response) => {
        console.log(response);
      }
    );
  }
}
