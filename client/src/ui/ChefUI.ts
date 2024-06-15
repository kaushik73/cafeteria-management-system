import * as readlineSync from "readline-sync";
import ChefService from "../services/ChefService";
import LoginUI from "./LoginUI";

export default class ChefUI {
  showChefMenu() {
    console.log("Chef Menu:");
    console.log("1. Generate Food Recommendations");
    console.log("2. Respond to Feedback");
    console.log("3. Generate Monthly Feedback Report");
    console.log("4. View Reports");
    console.log("5. Send Recommendation Notification");
    console.log("6. Send Menu Update Notification");
    console.log("7. Send Availability Notification");
    console.log("0. Logout");
    
    const choice = readlineSync.question("Choose an option: ");
    switch (choice) {
      case "1":
        ChefService.generateFoodRecommendations();
        break;
      case "2":
        ChefService.respondToFeedback();
        break;
      case "3":
        ChefService.generateMonthlyFeedbackReport();
        break;
      case "4":
        ChefService.viewReports();
        break;
      case "5":
        ChefService.sendRecommendationNotification();
        break;
      case "6":
        ChefService.sendMenuUpdateNotification();
        break;
      case "7":
        ChefService.sendAvailabilityNotification();
        break;
      case "0":
        new LoginUI().showLoginMenu();
        break;
      default:
        console.log("Invalid option!");
        this.showChefMenu();
    }
  }
}
