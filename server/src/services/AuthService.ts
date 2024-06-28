import { sqlDBOperations } from "../database/operations/sqlDBOperations";
import { IUser, IUserAndPreference } from "../models/User";
import userDetailStore from "../store/userDetailStore";
import LogService from "./LogService";

class AuthService {
  static async loginOLD(
    employeeID: string,
    password: string
  ): Promise<IUserAndPreference | null> {
    try {
      const userDetail: any = (await sqlDBOperations.runCustomQuery(
        `select * from User U inner JOIN preference P on P.user_id = U.user_ID where U.user_id = ${employeeID} and password = '${password}`
      )) as IUserAndPreference;
      // const userDetail: any = (await sqlDBOperations.selectOne("user", {
      //   user_id: employeeID,
      //   password: password,
      // })) as IUser;

      const action = `${userDetail.name} logged in as ${userDetail.role}`;
      const logOutput = await LogService.insertIntoLog(
        action,
        userDetail.user_id as number
      );
      userDetailStore.setUserDetail(userDetail);

      console.log("auth-service,userDetail", userDetail);

      return userDetail ? userDetail : null;
    } catch (error) {
      console.error("Error retrieving user role:", error);
      throw error;
    }
  }

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

      if (result.length > 0) {
        const userDetail: IUserAndPreference = result[0];

        const action = `${userDetail.name} logged in as ${userDetail.role}`;
        await LogService.insertIntoLog(action, userDetail.user_id as number);
        userDetailStore.setUserDetail(userDetail);

        console.log("auth-service, userDetail", userDetail);

        return userDetail;
      } else {
        return null;
      }
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
