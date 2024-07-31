import { sqlDBOperations } from "../database/operations/sqlDBOperations";
import { IUser, IUserAndPreference } from "../models/User";
import userDetailStore from "../store/userDetailStore";
import LogService from "./LogService";

class AuthService {
  static async login(
    employeeID: string,
    password: string
  ): Promise<IUserAndPreference | null> {
    try {
      const query = `
        SELECT * FROM User U 
        INNER JOIN preference P 
        ON P.user_id = U.user_ID 
        WHERE U.user_id = ${employeeID} 
        AND password = '${password}'
      `;
      const result: any = await sqlDBOperations.runCustomQuery(query);
      if (result != null) {
        const userDetail: IUserAndPreference = result[0];

        const action = `${userDetail.name} logged in as ${userDetail.role}`;
        await LogService.insertIntoLog(action, userDetail.user_id as number);
        userDetailStore.setUserDetail(userDetail);

        return userDetail;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error retrieving user role:", error);
      throw new Error("Invalid Credentails");
    }
  }

  static async logOut(userDetail: any) {
    try {
      const action = `${userDetail.name} logged out as ${userDetail.role}`;
      userDetailStore.clearUserDetail();
      const logOutput = await LogService.insertIntoLog(
        action,
        userDetail.user_id
      );
    } catch (error) {
      console.error("Error logging out:", error);
      throw error;
    }
  }
}

export default AuthService;
