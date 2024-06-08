import mysql, { Connection } from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();
export class MySqlConnection {
  private static connection: Connection;

  private static connectionObj = {
    // host: process.env.HOST,
    // user: process.env.SQL_USER,
    // connectionLimit: Number(process.env.SQL_CONNECTION_LIMTS),
    // password: process.env.SQL_PASSWORD,
    // port: Number(process.env.PORT),
    // database: process.env.SQL_DEFAULT_DATABASE,

    host: "localhost",
    user: "root",
    connectionLimit: 10,
    password: "Manan@123",
    port: 3306,
    database: "cafeteria",
  };
  // Initialize the connection
  public static async initializeConnection(): Promise<void> {
    // console.log(process.env.HOST);
    // console.log(process.env.SQL_USER);
    // console.log(process.env.SQL_CONNECTION_LIMTS);
    // console.log(process.env.SQL_PASSWORD);
    // console.log(process.env.PORT);
    console.log(process.env.SQL_DEFAULT_DATABASE);
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
