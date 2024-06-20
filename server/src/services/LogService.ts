// import connection from "./";
// log (
//     log_id INT AUTO_INCREMENT PRIMARY KEY,
//     user_id INT,
//     action VARCHAR(255) NOT NULL,
//     timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     FOREIGN KEY (user_id) REFERENCES Users(emp_id) ON DELETE CASCADE
// );
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
