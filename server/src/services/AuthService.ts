import { sqlDBOperations } from "../database/operations/sqlDBOperations";
import { User } from "../models/Users";

class AuthService {
  static async getUserDetail(
    employeeID: string,
    password: string
  ): Promise<User> {
    try {
      // const dbOp = new SqlOperation();
      const result: any = await sqlDBOperations.selectOne("users", {
        emp_id: employeeID,
        password: password,
      });
      console.log("xx", result);

      return result ? result : null;
    } catch (error) {
      console.error("Error retrieving user role:", error);
      throw error;
    }
  }
}

export default AuthService;
