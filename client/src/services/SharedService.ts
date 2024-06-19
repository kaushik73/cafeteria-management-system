import OutputService from "./OutputService";
import { socketService } from "./SocketService";

export class SharedService {
  async showMenuItems() {
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

  static getMenuIdFromName(menu_name: string): Promise<number> {
    return new Promise((resolve, reject) => {
      socketService.emitEvent(
        "getMenuIdFromName",
        menu_name, // Todo : LEARN WHAT THINGS CHANGES wHEn Passing the menu_name as an object
        (response: { message: number }) => {
          if (response && response.message) {
            resolve(response.message);
          } else {
            reject(new Error("Failed to get menu ID"));
          }
        }
      );
    });
  }
}
