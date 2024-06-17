import OutputService from "./OutputService";
import { socketService } from "./SocketService";

export class SharedService {
  async showMenuItems() {
    console.log("temp");

    return new Promise((resolve, reject) => {
      socketService.emitEvent(
        "showMenuItems",
        { meal_type: "desc" },
        (response: any) => {
          OutputService.printTable(response.message);
          resolve(response.message);
        }
      );
    });
  }
}
