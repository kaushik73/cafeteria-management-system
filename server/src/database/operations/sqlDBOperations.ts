import DatabaseOperation from "./databaseOperations";
import { MySqlConnection } from "../mysqlDBConnection";
import { Connection, Query } from "mysql2/promise";

class SqlOperation {
  //implements DatabaseOperation     ---TODO: make it work
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

  async insert(entityName: string, data: unknown): Promise<any> {
    try {
      await this.ensureInitialized();
      // console.log(`Inserting data into ${entityName}...`);
      const [result] = await this.connection.query(
        `INSERT INTO ${entityName} SET ?`,
        [data]
      );
      return result;
      // console.log(`Data inserted into ${entityName} successfully.`);
    } catch (error) {
      // console.error(`Error inserting data into ${entityName}:`, error);
      throw error;
    }
  }

  // //  Todo : Delete this fnx.

  // async updateOLD(
  //   entityName: string,
  //   filter: object,
  //   data: object
  // ): Promise<unknown> {
  //   try {
  //     await this.ensureInitialized();
  //     // console.log(`Updating data in ${entityName}...`);
  //     const result: any = await this.connection.query(
  //       `UPDATE ${entityName} SET ? WHERE ?`,
  //       [data, filter]
  //     );
  //     console.log(result);

  //     return result.length > 0 ? [result] : null;
  //     // console.log(`Data updated in ${entityName} successfully.`);
  //   } catch (error) {
  //     console.error(`Error updating data in ${entityName}:`, error);
  //     throw error;
  //   }
  // }

  async update(
    entityName: string,
    data: object, // Simplified filter handling (explained below)
    filter?: object // Optional filter for specific updates
  ): Promise<number | null> {
    try {
      await this.ensureInitialized();
      // console.log(`Updating data in ${entityName}...`);

      // Construct the UPDATE query with parameterized values
      let updateQuery = `UPDATE ${entityName} SET ?`;
      const params = [data];

      // Add WHERE clause with parameterized values if filter is provided
      if (filter) {
        updateQuery += " WHERE ?";
        params.push(filter);
      }

      const result: any = await this.connection.query(updateQuery, params);

      // Return the number of affected rows for success or null for errors
      return result[0].affectedRows > 0 ? result[0].affectedRows : null;

      // console.log(`Data updated in ${entityName} successfully.`);
    } catch (error) {
      console.error(`Error updating data in ${entityName}:`, error);
      throw error;
    }
  }

  //  Todo : Delete this fnx.
  // async selectAllOLD(
  //   entityName: string,
  //   filter?: object,
  //   orderBy?: any,
  //   operation?: any
  // ): Promise<unknown[]> {
  //   try {
  //     await this.ensureInitialized();
  //     // console.log("Selecting all data from", entityName);

  //     let query = `SELECT * FROM ${entityName}`;
  //     let queryParams: any[] = [];
  //     // const { conditionKey, conditionValue } = condition;
  //     console.log(operation, Object.values(operation));

  //     const operationValue = operation ? Object.values(operation) : "=";
  //     if (filter && Object.keys(filter).length > 0) {
  //       query +=
  //         " WHERE " +
  //         Object.keys(filter)
  //           .map((key) => `${key} ${operationValue} ?`)
  //           .join(" AND ");
  //       queryParams = Object.values(filter);
  //     }

  //     console.log(orderBy);
  //     console.log(filter);

  //     if (orderBy && Object.keys(orderBy).length > 0) {
  //       query +=
  //         " ORDER BY " +
  //         Object.keys(orderBy)
  //           .map((key) => `${key} ${orderBy[key] === "asc" ? "ASC" : "DESC"}`)
  //           .join(", ");
  //     }
  //     console.log(query);

  //     const [rows]: any = await this.connection.query(query, queryParams);
  //     // console.log("Data selected from", entityName, "successfully.");
  //     return rows;
  //   } catch (error) {
  //     // console.error("Error selecting data from", entityName, ":", error);
  //     throw error;
  //   }
  // }

  async selectAll(
    entityName: string,
    filter?: any,
    orderBy?: any,
    operations?: any
  ): Promise<unknown[]> {
    try {
      await this.ensureInitialized();
      let query = `SELECT * FROM ${entityName}`;
      let queryParams: any[] = [];

      if (filter && Object.keys(filter).length > 0) {
        const filterConditions = Object.keys(filter).map((key) => {
          const value = filter[key];
          const operation =
            operations && operations[key] ? operations[key] : "=";

          if (Array.isArray(value)) {
            queryParams.push(...value);
            return `${key} ${operation} (${value.map(() => "?").join(", ")})`;
          } else {
            queryParams.push(value);
            return `${key} ${operation} ?`;
          }
        });

        query += " WHERE " + filterConditions.join(" AND ");
      }

      if (orderBy && Object.keys(orderBy).length > 0) {
        query +=
          " ORDER BY " +
          Object.keys(orderBy)
            .map((key) => `${key} ${orderBy[key] === "asc" ? "ASC" : "DESC"}`)
            .join(", ");
      }
      console.log(query, queryParams);

      const [rows]: any = await this.connection.query(query, queryParams);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  async selectOne(entityName: string, filter?: object): Promise<unknown> {
    try {
      await this.ensureInitialized();

      if (!filter) {
        throw new Error("Filter is required");
      }

      const filterKeys = Object.keys(filter);
      const filterValues = Object.values(filter);

      if (filterKeys.length === 0) {
        throw new Error("Filter cannot be empty");
      }

      const whereClause = filterKeys.map((key) => `${key} = ?`).join(" AND ");

      const [rows]: any = await this.connection.query(
        `SELECT * FROM ${entityName} WHERE ${whereClause} LIMIT 1`,
        filterValues
      );
      console.log("yy", rows.length > 0 ? rows[0] : null);

      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error(`Error selecting one row from ${entityName}:`, error);
      throw error;
    }
  }

  async delete(entityName: string, filter: object): Promise<unknown> {
    try {
      await this.ensureInitialized();
      const row = await this.connection.query(
        `DELETE FROM ${entityName} WHERE ?`,
        [filter]
      );
      return row.length > 0 ? row[0] : null;
      // console.log(`Data deleted from ${entityName} successfully.`);
    } catch (error) {
      console.error(`Error deleting data from ${entityName}:`, error);
      throw new Error(`Error deleting data from ${entityName}`);
    }
  }

  async fetchDatawithCustomQuery(query: string) {
    try {
      await this.ensureInitialized();

      const [rows]: any = await this.connection.query(query);
      return rows.length > 0 ? rows : null;
    } catch (error) {
      throw error;
    }
  }
}

export const sqlDBOperations = new SqlOperation();
