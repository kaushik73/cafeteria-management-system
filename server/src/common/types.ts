export enum Role {
  Admin = "admin",
  Chef = "chef",
  Employee = "employee",
}

export interface Response<T> {
  status: "success" | "error" | "NAN";
  message: string;
  data: T;
}

// export interface ResultSetHeader {
//   fieldCount: number;
//   affectedRows: number;
//   insertId: number;
//   info: string;
//   serverStatus: number;
//   warningStatus: number;
//   changedRows: number;
// }
