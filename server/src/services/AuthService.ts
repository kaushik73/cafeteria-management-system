import { sqlDBOperations } from "../database/operations/sqlDBOperations";
import { IUser } from "../models/User";
import userDetailStore from "../store/userDetailStore";
import LogService from "./LogService";

class AuthService {
  static async login(
    employeeID: string,
    password: string
  ): Promise<IUser | null> {
    try {
      const userDetail: IUser = (await sqlDBOperations.selectOne("user", {
        user_id: employeeID,
        password: password,
      })) as IUser;
      const action = `${userDetail.name} logged in as ${userDetail.role}`;
      const logOutput = await LogService.insertIntoLog(
        action,
        userDetail.user_id as number
      );
      userDetailStore.setUserDetail(userDetail);
      return userDetail ? userDetail : null;
    } catch (error) {
      console.error("Error retrieving user role:", error);
      throw error;
    }
  }

  static async logOut(userDetail: any) {
    try {
      const action = `${userDetail.name} logged out as ${userDetail.role}`;
      userDetailStore.clearUserDetail();
      const logOutput = await LogService.insertIntoLog(
        action,
        userDetail.emp_id
      );
    } catch (error) {
      console.error("Error logging out:", error);
      throw error;
    }
  }
}

export default AuthService;
