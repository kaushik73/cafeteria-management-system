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

    // host: "localhost",
    // user: "root",
    // connectionLimit: 10,
    // password: "Manan@123",
    // port: 3306,
    // database: "testDB",
  };
  // Initialize the connection
  public static async initializeConnection(): Promise<void> {
    if (!MySqlConnection.connection) {
      try {
        console.log("initializeConnection");

        MySqlConnection.connection = await mysql.createConnection(
          MySqlConnection.connectionObj
        );
      } catch (err) {
        console.error("Error connecting to the database:", err);
      }
    }
  }

  // Get the connection
  public static async getConnection(): Promise<Connection> {
    if (!MySqlConnection.connection) {
      console.log("trying to setup connection");
      await MySqlConnection.initializeConnection();
    }
    console.log("from getConnection");

    return MySqlConnection.connection;
  }

  // Close the connection
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

const mySqlConnection = new MySqlConnection();
