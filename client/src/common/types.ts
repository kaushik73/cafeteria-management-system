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
