import { sqlDBOperations } from "../database/operations/sqlDBOperations";
import userDetailStore from "../store/userDetailStore";
import LogService from "../services/LogService";
import { Log } from "../models/Log";

jest.mock("../database/operations/sqlDBOperations");
jest.mock("../store/userDetailStore");

describe("LogService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("insertIntoLog", () => {
    it("should insert log data into the database and return the result", async () => {
      const mockResult: any = {
        insertId: 1,
        affectedRows: 1,
        warningStatus: 0,
      };

      (sqlDBOperations.insert as jest.Mock).mockResolvedValue(mockResult);

      const action = "testAction";
      const emp_id = 123;

      const result = await LogService.insertIntoLog(action, emp_id);

      expect(sqlDBOperations.insert).toHaveBeenCalledWith("log", {
        user_id: emp_id,
        action: action,
      });
      expect(result).toBe(mockResult);
    });
  });

  describe("logAction", () => {
    it("should log an action for the current user", async () => {
      const mockResult: any = {
        insertId: 1,
        affectedRows: 1,
        warningStatus: 0,
      };
      const mockUserDetail = { user_id: 123 };

      (userDetailStore.getUserDetail as jest.Mock).mockResolvedValue(
        mockUserDetail
      );
      (sqlDBOperations.insert as jest.Mock).mockResolvedValue(mockResult);

      const action = "testAction";

      const result = await LogService.logAction(action);

      expect(userDetailStore.getUserDetail).toHaveBeenCalled();
      expect(sqlDBOperations.insert).toHaveBeenCalledWith("log", {
        user_id: mockUserDetail.user_id,
        action: action,
      });
      expect(result).toBe(mockResult);
    });
  });

  describe("getLog", () => {
    it("should retrieve logs from the database", async () => {
      const mockLogs: Log[] = [
        {
          user_id: 1,
          action: "action1",
          timestamp: new Date("2024-08-11T12:00:00Z"),
        },
        {
          user_id: 2,
          action: "action2",
          timestamp: new Date("2024-08-11T13:00:00Z"),
        },
      ];

      (sqlDBOperations.selectAll as jest.Mock).mockResolvedValue(mockLogs);

      const result = await LogService.getLog();

      expect(sqlDBOperations.selectAll).toHaveBeenCalledWith(
        "log",
        {},
        { timestamp: "desc" }
      );
      expect(result).toEqual(mockLogs);
    });
  });
});
