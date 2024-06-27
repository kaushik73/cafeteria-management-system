export interface IUser {
  id: number;
  role: "admin" | "chef" | "employee";
  name: string;
  email: string;
  user_id?: number;
  password: string;
}
