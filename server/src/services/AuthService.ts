import { sqlDBOperations } from "../database/operations/sqlDBOperations";
import { User } from "../models/Users";
import userDetailStore from "../store/userDetailStore";
import LogService from "./LogService";

class AuthService {
  static async login(
    employeeID: string,
    password: string
  ): Promise<User | null> {
    try {
      const userDetail: User = (await sqlDBOperations.selectOne("users", {
        emp_id: employeeID,
        password: password,
      })) as User;
      const action = `${userDetail.name} logged in as ${userDetail.role}`;
      const logOutput = await LogService.logAction(
        action,
        userDetail.emp_id as number
      );
      userDetailStore.setUserDetail(userDetail);
      return userDetail ? userDetail : null;
    } catch (error) {
      console.error("Error logging in:", error);
      throw new Error("Error logging in");
    }
  }

  static async logOut(userDetail: any) {
    try {
      const action = `${userDetail.name} logged out as ${userDetail.role}`;
      userDetailStore.clearUserDetail();
      const logOutput = await LogService.logAction(action, userDetail.emp_id);
    } catch (error) {
      console.error("Error logging out:", error);
      throw error;
    }
  }
}

export default AuthService;
