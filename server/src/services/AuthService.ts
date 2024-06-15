import SqlOperation from "../database/operations/sqlDBOperations";
import { Role } from "../common/types";

class AuthService {
  static async getUserRole(
    employeeID: string,
    password: string
  ): Promise<Role | null> {
    try {
      const dbOp = new SqlOperation();
      const result: any = await dbOp.selectOne("users", {
        emp_id: employeeID,
        password: password,
      });
      return result ? result.role : null;
    } catch (error) {
      console.error("Error retrieving user role:", error);
      throw error;
    }
  }
}

export default AuthService;
