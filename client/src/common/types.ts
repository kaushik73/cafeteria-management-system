export enum Role {
  Admin = "admin",
  Chef = "chef",
  Employee = "employee",
}
export interface MealTypes {
  Lunch: "lunch";
  Dinner: "dinner";
  Breakfast: "breakfast";
}

export interface Response<T> {
  status: "success" | "error" | "NAN";
  message: string;
  data: T;
}

export interface Response<T> {
  status: "success" | "error" | "NAN";
  message: string;
  data: T;
}

export interface Response<T> {
  status: "success" | "error" | "NAN";
  message: string;
  data: T;
}
