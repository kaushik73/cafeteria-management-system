import { Menu } from "../models/Menu";
import OutputService from "./OutputService";
import { socketService } from "./SocketService";

export class SharedService {
  async showMenuItems() {
    return new Promise((resolve, reject) => {
      socketService.emitEvent(
        "showMenuItems",
        { meal_type: "desc" },
        (response: any) => {
          // console.log(response.message);

          OutputService.printTable(response.message);
          resolve(response.message);
        }
      );
    });
  }

  // static getMenuIdFromName(menu_name: string): Promise<number> {
  //   return new Promise((resolve, reject) => {
  //     socketService.emitEvent(
  //       "getMenuIdFromName",
  //       menu_name,
  //       (response: { message: number }) => {
  //         if (response && response.message) {
  //           resolve(response.message);
  //         } else {
  //           reject(new Error("Failed to get menu ID"));
  //         }
  //       }
  //     );
  //   });
  // }

  // static getMenuDetailFromId(menu_id: number): Promise<Menu> {
  //   return new Promise((resolve, reject) => {
  //     socketService.emitEvent(
  //       "getMenuDetailFromId",
  //       { menu_id },
  //       (response: { message: Menu }) => {
  //         resolve(response.message);
  //       }
  //     );
  //   });
  // }
}
