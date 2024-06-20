import { sqlDBOperations } from "../database/operations/sqlDBOperations";
import { User } from "../models/Users";
import userDetailStore from "../store/userDetailStore";
import LogService from "./LogService";

class AuthService {
  static async login(employeeID: string, password: string): Promise<User> {
    try {
      const result: any = await sqlDBOperations.selectOne("users", {
        emp_id: employeeID,
        password: password,
      });
      const action = `${result.name} logged in as ${result.role}`;
      const logOutput = await LogService.logAction(action, result.emp_id);
      userDetailStore.setUserDetail(result);
      return result ? result : null;
    } catch (error) {
      console.error("Error retrieving user role:", error);
      throw error;
    }
  }

  static async logOut(userDetail: any) {
    const action = `${userDetail.name} logged out as ${userDetail.role}`;
    userDetailStore.clearUserDetail();
    const logOutput = await LogService.logAction(action, userDetail.emp_id);
  }
}

export default AuthService;
