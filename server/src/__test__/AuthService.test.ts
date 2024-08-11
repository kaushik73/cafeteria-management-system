import AuthService from "../services/AuthService";
import LogService from "../services/LogService";
import { sqlDBOperations } from "../database/operations/sqlDBOperations";
import userDetailStore from "../store/userDetailStore";

jest.mock("./LogService");
jest.mock("../database/operations/sqlDBOperations");
jest.mock("../store/userDetailStore");

describe("AuthService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("login", () => {
    it("should return user details on successful login", async () => {
      const employeeID = "101";
      const password = "pass";
      const mockUserDetail: any = {
        user_id: 123,
        role: "admin",
      };

      const mockResult = [mockUserDetail];

      sqlDBOperations.runCustomQuery = jest.fn().mockResolvedValue(mockResult);
      LogService.insertIntoLog = jest.fn().mockResolvedValue(true);
      userDetailStore.setUserDetail = jest.fn();

      const result = await AuthService.login(employeeID, password);

      expect(sqlDBOperations.runCustomQuery).toHaveBeenCalledWith(
        expect.stringContaining(employeeID)
      );
      expect(result).toEqual(mockUserDetail);
      expect(LogService.insertIntoLog).toHaveBeenCalledWith(
        `${mockUserDetail.name} logged in as ${mockUserDetail.role}`,
        mockUserDetail.user_id
      );
      expect(userDetailStore.setUserDetail).toHaveBeenCalledWith(
        mockUserDetail
      );
    });

    it("should return null if login fails", async () => {
      const employeeID = "101";
      const password = "wrongpass123";

      sqlDBOperations.runCustomQuery = jest.fn().mockResolvedValue(null);

      const result = await AuthService.login(employeeID, password);

      expect(result).toBeNull();
    });

    it("should throw an error if login encounters an error", async () => {
      const employeeID = "123";
      const password = "password123";

      sqlDBOperations.runCustomQuery = jest
        .fn()
        .mockRejectedValue(new Error("Query failed"));

      await expect(AuthService.login(employeeID, password)).rejects.toThrow(
        "Invalid Credentails"
      );
    });
  });

  describe("logOut", () => {
    it("should log out the user and clear user details", async () => {
      const mockUserDetail = {
        user_id: 101,
        role: "admin",
      };

      userDetailStore.clearUserDetail = jest.fn();
      LogService.insertIntoLog = jest.fn().mockResolvedValue(true);

      await AuthService.logOut(mockUserDetail);

      expect(userDetailStore.clearUserDetail).toHaveBeenCalled();
      expect(LogService.insertIntoLog).toHaveBeenCalledWith(
        `${mockUserDetail.user_id} logged out as ${mockUserDetail.role}`,
        mockUserDetail.user_id
      );
    });
  });
});
