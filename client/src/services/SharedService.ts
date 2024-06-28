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
          const filteredResponse = response.message.map((menu: Menu) => {
            const {
              menu_id,
              item_name,
              price,
              availability_status,
              ...restOfMenu
            } = menu;
            const availabilityStatus =
              availability_status == false ? "not available" : "available";
            return { menu_id, item_name, price, availabilityStatus };
          });
          // todo : change date format from server/ client
          OutputService.printTable(filteredResponse);
          resolve(response.message);
        }
      );
    });
  }

  getformatedDate(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }
}
