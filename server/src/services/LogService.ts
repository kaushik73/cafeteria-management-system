import { sqlDBOperations } from "../database/operations/sqlDBOperations";

class LogService {
  static async logAction(action: string, emp_id: number): Promise<void> {
    const logData = {
      user_id: emp_id,
      action: action,
    };
    console.log(logData, "logData");

    sqlDBOperations.insert("log", logData);
  }
}

export default LogService;
