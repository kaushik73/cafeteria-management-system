import mysql, { Connection } from "mysql2/promise";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(__dirname, "../../.env") });
export class MySqlConnection {
  private static connection: Connection;
  private static connectionObj = {
    host: process.env.HOST as string,
    user: process.env.SQL_USER as string,
    connectionLimit: Number(process.env.SQL_CONNECTION_LIMTS),
    password: process.env.SQL_PASSWORD as string,
    port: Number(process.env.PORT),
    database: process.env.SQL_DEFAULT_DATABASE as string,
  };

  public static async initializeConnection(): Promise<void> {
    if (!MySqlConnection.connection) {
      try {
        console.log(
          MySqlConnection.connectionObj.user,
          MySqlConnection.connectionObj.port
        );

        console.log("initializeConnection");

        MySqlConnection.connection = await mysql.createConnection(
          MySqlConnection.connectionObj
        );
      } catch (err) {
        console.error("Error connecting to the database:", err);
      }
    }
  }

  public static async getConnection(): Promise<Connection> {
    if (!MySqlConnection.connection) {
      console.log("trying to setup connection");
      await MySqlConnection.initializeConnection();
    }
    console.log("from getConnection");

    return MySqlConnection.connection;
  }

  public static async closeConnection(): Promise<void> {
    if (MySqlConnection.connection) {
      try {
        await MySqlConnection.connection.end();
        console.log("Database connection closed.");
      } catch (err) {
        console.error("Error closing the connection:", err);
      }
    }
  }
}
