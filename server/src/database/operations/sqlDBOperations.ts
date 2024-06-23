// import DatabaseOperation from "./databaseOperations";
import { MySqlConnection } from "../mysqlDBConnection";
import { Connection, Query, ResultSetHeader } from "mysql2/promise";

class SqlOperation {
  //implements DatabaseOperation     ---TODO: make it work
  private connection!: Connection;

  constructor() {
    this.init();
  }

  async init() {
    try {
      this.connection = await MySqlConnection.getConnection();
      console.log("init called");
    } catch (error) {
      throw error;
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
      const [result] = await this.connection.query(
        `INSERT INTO ${entityName} SET ?`,
        [data]
      );
      console.log(`Data inserted into ${entityName} successfully.`, result);
      return result;
    } catch (error) {
      console.error(`Error inserting data into ${entityName}:`, error);
      throw error;
    }
  }

  async update(
    entityName: string,
    data: object,
    filter?: object
  ): Promise<ResultSetHeader> {
    try {
      await this.ensureInitialized();

      let updateQuery = `UPDATE ${entityName} SET ?`;
      const params = [data];

      if (filter) {
        updateQuery += " WHERE ?";
        params.push(filter);
      }

      const [result]: any = await this.connection.query(updateQuery, params);

      return result;
    } catch (error) {
      console.error(`Error updating data in ${entityName}:`, error);
      throw error;
    }
  }

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
      // console.log(query, queryParams);

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

      const [row]: any = await this.connection.query(
        `SELECT * FROM ${entityName} WHERE ${whereClause} LIMIT 1`,
        filterValues
      );
      console.log(
        `SELECT * FROM ${entityName} WHERE ${whereClause} LIMIT 1`,
        filterValues
      );

      return row;
    } catch (error) {
      console.error(`Error selecting one row from ${entityName}:`, error);
      throw error;
    }
  }

  async delete(entityName: string, filter: object): Promise<ResultSetHeader> {
    try {
      await this.ensureInitialized();

      let deleteQuery = `DELETE FROM ${entityName}`;
      const filterKeys = Object.keys(filter);
      const params: any[] = [];

      if (filterKeys.length > 0) {
        const whereClauses = filterKeys
          .map((key) => `${key} = ?`)
          .join(" AND ");
        deleteQuery += ` WHERE ${whereClauses}`;
        filterKeys.forEach((key) => {
          params.push((filter as any)[key]);
        });
      }

      console.log(deleteQuery, params);

      const [result]: any = await this.connection.query(deleteQuery, params);

      return result;
    } catch (error) {
      console.error(`Error deleting data from ${entityName}:`, error);
      throw new Error(`Error deleting data from ${entityName}`);
    }
  }

  async runCustomQuery(query: string) {
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
