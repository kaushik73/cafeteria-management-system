import NotificationService from "../services/NotificationService";
import DateService from "../services/DateService";
import { sqlDBOperations } from "../database/operations/sqlDBOperations";
import { defaultItemValues } from "../common/contants";

jest.mock("./DateService");
jest.mock("../database/operations/sqlDBOperations");
jest.mock("../common/contants");

describe("NotificationService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("addNotification", () => {
    it("should add a notification successfully", async () => {
      const type = "menuAdded";
      const message = "MenuId 16 added";
      const menuId = 16;
      const mockDate = "2024-08-11";
      DateService.getCurrentDate = jest.fn().mockReturnValue(mockDate);

      await NotificationService.addNotification(type, message, menuId);

      expect(sqlDBOperations.insert).toHaveBeenCalledWith("Notification", {
        notification_type: type,
        message: message,
        notification_date: mockDate,
        menu_id: menuId,
      });
    });

    it("should throw an error when adding a notification fails", async () => {
      const type = "MenuUpdate";
      const message = "MenuId 12 Updated";
      const menuId = 12;
      const mockDate = "2024-08-11";
      DateService.getCurrentDate = jest.fn().mockReturnValue(mockDate);
      sqlDBOperations.insert = jest
        .fn()
        .mockRejectedValue(new Error("Insert failed"));

      await expect(
        NotificationService.addNotification(type, message, menuId)
      ).rejects.toThrow("Error adding notification: Insert failed");
    });
  });

  describe("seeNotifications", () => {
    it("should return notifications", async () => {
      const expiryDays = 7;
      const expiryDate = "2024-08-04";
      const formattedExpiryDate = expiryDate.split(" ")[0];
      const mockData = [
        {
          menu_id: 12,
          notification_type: "menuUpdate",
          message: "MenuId 12 Updated",
          notification_date: "2024-08-10",
        },
        {
          menu_id: 16,
          notification_type: "menuAdded",
          message: "MenuId 16 added",
          notification_date: "2024-08-09",
        },
      ];

      defaultItemValues.notification_expiry = expiryDays;
      DateService.getNthPreviousDate = jest.fn().mockReturnValue(expiryDate);
      sqlDBOperations.selectAll = jest.fn().mockResolvedValue(mockData);

      const data = await NotificationService.seeNotifications();

      expect(DateService.getNthPreviousDate).toHaveBeenCalledWith(expiryDays);
      expect(sqlDBOperations.selectAll).toHaveBeenCalledWith(
        "Notification",
        { notification_date: formattedExpiryDate },
        { notification_date: "desc" },
        { notification_date: ">" }
      );
      expect(data).toEqual(mockData);
    });
  });
});
