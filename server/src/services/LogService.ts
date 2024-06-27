import { ResultSetHeader } from "mysql2";
import { sqlDBOperations } from "../database/operations/sqlDBOperations";
import { Log } from "../models/Log";

class LogService {
  static async insertIntoLog(
    action: string,
    emp_id: number
  ): Promise<ResultSetHeader> {
    const logData = {
      user_id: emp_id,
      action: action,
    };

    const result = sqlDBOperations.insert("log", logData);
    return result;
  }

  static async getLog(): Promise<Log[]> {
    const result: Log[] = (await sqlDBOperations.selectAll(
      "log",
      {},
      { timestamp: "desc" }
    )) as Log[];

    return result;
  }
}

export default LogService;
