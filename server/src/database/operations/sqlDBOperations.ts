import DatabaseOperation from "./databaseOperations";
import { MySqlConnection } from "../mysqlDBConnection";
import { Connection } from "mysql2/promise";

export default class SqlOperation implements DatabaseOperation {
  private connection!: Connection;

  constructor() {
    this.init();
  }

  async init() {
    try {
      // console.log("Initializing connection...");
      this.connection = await MySqlConnection.getConnection();
      // console.log("Connection initialized successfully.");
    } catch (error) {
      // console.error("Error initializing connection:", error);
      throw error; // Re-throw the error to be handled by the caller
    }
  }

  private async ensureInitialized() {
    if (!this.connection) {
      await this.init();
    }
  }

  async insert(entityName: string, data: unknown): Promise<unknown> {
    try {
      await this.ensureInitialized();
      // console.log(`Inserting data into ${entityName}...`);
     return await this.connection.query(`INSERT INTO ${entityName} SET ?`, [data]);
      // console.log(`Data inserted into ${entityName} successfully.`);
    } catch (error) {
      // console.error(`Error inserting data into ${entityName}:`, error);
      throw error;
    }
  }

  async update(entityName: string, filter: object, data: unknown): Promise<unknown> {
    try {
      await this.ensureInitialized();
      // console.log(`Updating data in ${entityName}...`);
     return await this.connection.query(`UPDATE ${entityName} SET ? WHERE ?`, [data, filter]);
      // console.log(`Data updated in ${entityName} successfully.`);
    } catch (error) {
      // console.error(`Error updating data in ${entityName}:`, error);
      throw error;
    }
  }

  async selectAll(entityName: string, filter?: object): Promise<unknown[]> {
    try {
      await this.ensureInitialized();
      // console.log("Selecting all data from", entityName);

      let query = `SELECT * FROM ${entityName}`;
      let queryParams: any[] = [];

      if (filter && Object.keys(filter).length > 0) {
        query += " WHERE " + Object.keys(filter).map(key => `${key} = ?`).join(" AND ");
        queryParams = Object.values(filter);
      }

      const [rows]: any = await this.connection.query(query, queryParams);
      // console.log("Data selected from", entityName, "successfully.");
      return rows;
    } catch (error) {
      // console.error("Error selecting data from", entityName, ":", error);
      throw error;
    }
  }

  async selectOne(entityName: string, filter?: object): Promise<unknown> {
    try {
      await this.ensureInitialized();
      // console.log("Selecting one row from", entityName);

      const [rows]: any = await this.connection.query(`SELECT * FROM ${entityName} WHERE ? LIMIT 1`, [filter]);
      // console.log("One row selected from", entityName, "successfully.");
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      // console.error("Error selecting one row from", entityName, ":", error);
      throw error;
    }
  }

  async delete(entityName: string, filter: object): Promise<unknown> {
    try {
      await this.ensureInitialized();
      // console.log(`Deleting data from ${entityName}...`);
      return await this.connection.query(`DELETE FROM ${entityName} WHERE ?`, [filter]);
      // console.log(`Data deleted from ${entityName} successfully.`);
    } catch (error) {
      // console.error(`Error deleting data from ${entityName}:`, error);
      throw error;
    }
  }
}
